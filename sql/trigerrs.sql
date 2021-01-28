-- update promo price --
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


-- update product rating --
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


-- handle promo updates --
-- walidacja wartości zniżki promocyjnej
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

-- update promo price
-- zmiana zniżki promocyjnej odświeża ceny promocyjne produktów
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


-- delete promo
-- usunięcie promocji odświeża ceny promocyjne produktów
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


-- insert product ininto service controll
---- protecting from inserting product out of warranty
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





-- update fulfilment date after order status modify
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