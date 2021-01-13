-- 6 best rated products for the main page
DROP VIEW IF EXISTS najwyzej_oceniane;

CREATE VIEW najwyzej_oceniane AS
    SELECT p.*, o.srednia_ocena 
    FROM produkt p RIGHT JOIN 
        (SELECT avg(gwiazdki::text::integer) AS srednia_ocena, 
        produkt_id
        FROM opinia 
        GROUP BY produkt_id
        LIMIT 6) o 
    ON p.id=o.produkt_id;


-- clear products names for search bar
DROP VIEW IF EXISTS wszystkie_nazwy_produktow;

CREATE VIEW wszystkie_nazwy_produktow AS
    SELECT nazwa FROM produkt;


-- products in service
DROP VIEW IF EXISTS produkty_w_serwisie;

CREATE VIEW produkty_w_serwisie AS
    SELECT s.id as id_serwis,
           s.opis_usterki,
           s.status,
           s.ilosc,
           ppzz.*
    FROM serwis s LEFT JOIN
        (SELECT DATE(z.data_zrealizowania) as data_zrealizowania,
                ppz.*
        FROM zamowienie z RIGHT JOIN
            (SELECT p.nazwa,
                    p.okres_gwarancji,
                    p.producent,
                    p.stan_magazynu,
                    pz.zamowienie_id as id_zamowienia,
                    pz.produkt_id as id_produkt,
                    pz.id as id_pozycja_zamowienia
            FROM produkt p
            LEFT JOIN pozycja_zamowienia pz
            ON p.id = pz.produkt_id) ppz
        ON ppz.id_zamowienia = z.id) ppzz
    ON ppzz.id_pozycja_zamowienia = s.pozycja_zamowienia_id;

