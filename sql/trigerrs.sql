-- aktualizacja ceny promocyjnej produktu
-- wraz z zabezpieczeniem przed ujemnym stanem magazynowym
CREATE OR REPLACE FUNCTION zmodyfikuj_promo_cena()
RETURNS trigger AS $$
DECLARE
    discount REAL := 0.0;
BEGIN
    IF (NEW.stan_magazynu < 0) THEN
        IF (TG_OP = 'UPDATE') THEN
            RETURN OLD;
        ELSIF (TG_OP = 'INSERT') THEN
            RETURN NULL;
        END IF;
    END IF;
    
    IF NEW.promocja IS NOT NULL THEN
        discount := (SELECT (1-znizka) FROM promocja WHERE id=NEW.promocja);
        NEW.cena_promo := NEW.cena * discount;
    ELSE 
        NEW.cena_promo := NULL;
    END IF;
    RETURN NEW;
END $$
LANGUAGE 'plpgsql';

CREATE TRIGGER promo_cena BEFORE INSERT OR UPDATE ON produkt
FOR EACH ROW
EXECUTE PROCEDURE zmodyfikuj_promo_cena();


-- przelicza średnią ocenę produktu
CREATE OR REPLACE FUNCTION zmodyfikuj_srednia_ocena()
RETURNS trigger AS $$
DECLARE
    srednia REAL := 0.0;
BEGIN
    IF OLD IS NOT NULL THEN
        srednia := (SELECT avg(gwiazdki::text::integer) FROM opinia o WHERE o.produkt_id=OLD.produkt_id);
        UPDATE produkt SET srednia_ocena=srednia WHERE id=OLD.produkt_id;
    ELSE
        srednia := (SELECT avg(gwiazdki::text::integer) FROM opinia o WHERE o.produkt_id=NEW.produkt_id);
        UPDATE produkt SET srednia_ocena=srednia WHERE id=NEW.produkt_id;
    END IF;
    RETURN NEW;
END $$
LANGUAGE 'plpgsql';

CREATE TRIGGER srednia_ocena AFTER INSERT OR UPDATE OR DELETE ON opinia
FOR EACH ROW EXECUTE PROCEDURE zmodyfikuj_srednia_ocena();


-- walidacja wartości zniżki promocyjnej.
-- Poprawny zakres: (0.00, 0.99) 
CREATE OR REPLACE FUNCTION promocja_update_cena()
RETURNS trigger AS $$
BEGIN
    IF NEW.znizka < 0.0 OR NEW.znizka > 0.99 THEN
        IF (TG_OP = 'UPDATE') THEN
            RETURN OLD;
        ELSIF (TG_OP = 'INSERT') THEN
            RETURN NULL;
        END IF;
    END IF;

    RETURN NEW;
END $$
LANGUAGE 'plpgsql';

CREATE TRIGGER promocja_update_cena 
BEFORE INSERT OR UPDATE ON promocja
FOR EACH ROW
EXECUTE PROCEDURE promocja_update_cena();


-- aktualizacja cen promocyjnych produktu przy zmianie wartości zniżki promocji
CREATE OR REPLACE FUNCTION promocja_update()
RETURNS trigger AS $$
BEGIN
    UPDATE produkt SET promocja=NEW.id WHERE promocja=OLD.id;
    RETURN NULL;
END $$
LANGUAGE 'plpgsql';

CREATE TRIGGER promocja_update AFTER UPDATE ON promocja
FOR EACH ROW
EXECUTE PROCEDURE promocja_update();


-- aktualizacja cen promocyjnych produktu przy usunięciu promocji
CREATE OR REPLACE FUNCTION promocja_delete()
RETURNS trigger AS $$
BEGIN
    UPDATE produkt SET promocja=NULL WHERE promocja=OLD.id;
    RETURN OLD;
END $$
LANGUAGE 'plpgsql';

CREATE TRIGGER promocja_delete BEFORE DELETE ON promocja
FOR EACH ROW
EXECUTE PROCEDURE promocja_delete();


-- zabezpieczenie przed wprowadzeniem do serwisu produktu, którego okres gwarancyjny wygasł 
CREATE OR REPLACE FUNCTION sprawdz_aktywnosc_gwarancji()
RETURNS trigger AS $$
DECLARE
    diff INTEGER := 0;
    warrantyTime INTEGER;
BEGIN
    warrantyTime := (select okres_gwarancji from produkt p where p.id=(SELECT produkt_id FROM pozycja_zamowienia WHERE id=NEW.pozycja_zamowienia_id));
    diff := (SELECT round(( now()::date - data_zrealizowania::date ) / 31) AS days FROM zamowienie WHERE zamowienie.id=(select zamowienie_id from pozycja_zamowienia where id=NEW.pozycja_zamowienia_id));

    IF (warrantyTime - diff) > 0 THEN
        return NEW;
    ELSE
        return NULL;
    end if;
END $$
LANGUAGE 'plpgsql';

CREATE TRIGGER sprawdz_aktywnosc_gwarancji BEFORE INSERT ON serwis
FOR EACH ROW
EXECUTE PROCEDURE sprawdz_aktywnosc_gwarancji();


-- zabezpieczenie przed wprowadzniem zbyt dużej ilości produktów z danego zamówienia do serwisu
CREATE OR REPLACE FUNCTION sprawdz_ilosc_produktow_w_serwisie()
RETURNS trigger AS $$
DECLARE
    orderedProductsCount INTEGER := 0;
    inServiceProductCount INTEGER := 0;
BEGIN
    inServiceProductCount := (select count(*) from serwis where pozycja_zamowienia_id=NEW.pozycja_zamowienia_id);
    orderedProductsCount := (select ilosc from pozycja_zamowienia where id=NEW.pozycja_zamowienia_id);

    IF (orderedProductsCount - inServiceProductCount) > 0 THEN
        return NEW;
    ELSE
        return NULL;
    end if;
END $$
LANGUAGE 'plpgsql';

CREATE TRIGGER sprawdz_ilosc_produktow_w_serwisie BEFORE INSERT ON serwis
FOR EACH ROW
EXECUTE PROCEDURE sprawdz_ilosc_produktow_w_serwisie();


-- automatyczne wypełnienie daty zrealizowania zamówienia przy zmianie statusu zamówienia na 'zrealizowane'
-- lub jej usunięcie w przypadku innego wprowadzanego statusu zamówienia
CREATE OR REPLACE FUNCTION aktualizuj_data_zrealizowania()
RETURNS trigger AS $$
BEGIN
    IF (NEW.status = 'zrealizowane') THEN
        NEW.data_zrealizowania :=  now();
    ELSE 
        NEW.data_zrealizowania :=  NULL;
    END IF;
    RETURN NEW;
END $$
LANGUAGE 'plpgsql';

CREATE TRIGGER aktualizuj_data_zrealizowania 
BEFORE UPDATE ON zamowienie
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE PROCEDURE aktualizuj_data_zrealizowania();