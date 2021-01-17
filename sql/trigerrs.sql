-- update promo price --
CREATE OR REPLACE FUNCTION zmodyfikuj_promo_cena()
RETURNS trigger AS $$
DECLARE
    discount REAL := 0.0;
BEGIN
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
-- validate update promo price
CREATE OR REPLACE FUNCTION promocja_update_cena()
RETURNS trigger AS $$
BEGIN
    IF NEW.znizka < 0.0 OR NEW.znizka > 0.99 THEN
        RAISE EXCEPTION 'Niepoprawna wartość zniżki.';
        IF OLD IS NOT NULL THEN
            RETURN OLD;
        END IF;
        RETURN NULL;
    END IF;
    RETURN NEW;
END $$
LANGUAGE 'plpgsql';

CREATE TRIGGER promocja_update_cena BEFORE INSERT OR UPDATE ON promocja
FOR EACH ROW
EXECUTE PROCEDURE promocja_update_cena();

-- update promo price
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
