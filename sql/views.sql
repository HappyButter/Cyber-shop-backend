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
           ppzz.*
    FROM serwis s LEFT JOIN
        (SELECT DATE(z.data_zrealizowania) as data_zrealizowania_zamowienia,
                ppz.*
        FROM zamowienie z RIGHT JOIN
            (SELECT p.nazwa,
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


-- product full info
DROP VIEW IF EXISTS produkt_pelne_info;

CREATE VIEW produkt_pelne_info AS
    SELECT p.*, kp.nazwa as nazwa_kategorii, kp.typ
    FROM produkt p LEFT JOIN kategoria_produktu kp
        ON kp.id=p.kategoria;

-- product with profit margin calculated
DROP VIEW IF EXISTS produkt_pelne_info_z_marza;

CREATE VIEW produkt_pelne_info_z_marza AS
    SELECT id,
        nazwa,
        opis,
        srednia_ocena,
        producent,
        okres_gwarancji,
        stan_magazynu,
        promocja,
        kategoria,
        nazwa_kategorii,
        typ,
            ROUND(cena_promo * (1.0 + marza), 2) as cena_promo,
            ROUND(cena * (1.0 + marza), 2) as cena
    FROM produkt_pelne_info 
    WHERE stan_magazynu>0;


-- 6 best rated products for the main page
DROP VIEW IF EXISTS rekomendowane;

CREATE VIEW rekomendowane AS
    SELECT id, nazwa, cena, cena_promo, srednia_ocena, producent, stan_magazynu, promocja, kategoria, nazwa_kategorii, typ FROM produkt_pelne_info_z_marza
    ORDER BY srednia_ocena LIMIT 6;


-- order full info
DROP VIEW IF EXISTS zamowienie_pelne_info;

CREATE VIEW zamowienie_pelne_info AS
    SELECT z.uzytkownik_id,
        DATE(z.data_utworzenia) as data_utworzenia,
        DATE(z.data_zrealizowania) as data_zrealizowania,
        z.koszt_produktow,
        z.koszt_dostawy,
        z.uwagi_klienta,
        sp.czy_zaplacone,
        sp.id as status_platnosci_id,
        sp.typ_platnosci,
        z.tytul,
        a.id as adres_id,
        a.panstwo,
        a.kod_pocztowy,
        a.miejscowosc,
        a.ulica,
        a.nr_budynku,
        a.nr_lokalu
        FROM zamowienie z
        JOIN status_platnosci sp on z.id = sp.zamowienie_id
        JOIN adres a on z.adres_id = a.id;


-- ordered products
DROP VIEW IF EXISTS zamowione_produkty;

CREATE VIEW zamowione_produkty AS 
    SELECT p.nazwa, pz.produkt_id, pz.ilosc, pz.cena_za_sztuke 
    FROM pozycja_zamowienia pz
        JOIN produkt p ON pz.produkt_id = p.id;
