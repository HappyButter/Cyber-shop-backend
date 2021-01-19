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
        (SELECT DATE(z.data_zrealizowania) as data_zrealizowania_zamowienia,
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


-- product full info
DROP VIEW IF EXISTS produkt_pelne_info;

CREATE VIEW produkt_pelne_info AS
    SELECT p.*, kp.nazwa as nazwa_kategorii, kp.typ 
    FROM produkt p LEFT JOIN kategoria_produktu kp
        ON kp.id=p.kategoria;


-- 6 best rated products for the main page
DROP VIEW IF EXISTS rekomendowane;

CREATE VIEW rekomendowane AS
    SELECT id, nazwa, cena, cena_promo, srednia_ocena, producent, stan_magazynu, promocja, kategoria, nazwa_kategorii, typ  FROM produkt_pelne_info
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
        sp.tytul as tytul_platnosci,
        a.id as adres_id,
        a.panstwo,
        a.kod_pocztowy,
        a.miejscowosc,
        a.ulica,
        a.nr_budynku,
        a.nr_lokalu,
        ppipz.*
        FROM zamowienie z
        JOIN status_platnosci sp on z.id = sp.zamowienie_id
        JOIN adres a on z.adres_id = a.id
        JOIN (SELECT ppi.id as produkt_id,
                    ppi.nazwa as nazwa_produktu,
                    ppi.opis as opis_produktu,
                    CASE
                        WHEN ppi.cena_promo IS NULL THEN ppi.cena
                        ELSE ppi.cena
                    END as cena_produktu,
                    ppi.srednia_ocena as srednia_ocena_produktu,
                    ppi.producent,
                    ppi.okres_gwarancji,
                    ppi.stan_magazynu,
                    ppi.promocja,
                    ppi.nazwa_kategorii,
                    ppi.typ as typ_kategorii,
                    pz.id as pozycja_zamowienia_id,
                    pz.ilosc,
                    pz.zamowienie_id
                FROM produkt_pelne_info ppi
                LEFT JOIN pozycja_zamowienia pz
                ON ppi.id = pz.produkt_id) ppipz
            ON ppipz.zamowienie_id = z.id;