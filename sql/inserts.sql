INSERT INTO uzytkownik(typ, imie, nazwisko, email, telefon, haslo)
VALUES 
    ('klient', 'Adrian', 'Fórman', 'forman@email.com', '+48222456789', '123456'),
    ('klient', 'Roman', 'Jarosiński', 'jarosinski@email.com', '+48222456719', '123456'),
    ('admin', 'Kasia', 'Jasia', 'jasia@email.com', '+48222456719', 'admin'),
    ('admin', 'Jan', 'Kowalski', 'kowalski@email.com', '+48322456719', 'admin'),
    ('klient', 'Janusz', 'Kowalski', 'k2owalski@email.com', '+48322456739', 'klient'),
    ('admin', 'Jan', 'Długosz', 'a@a.com', '+48322456719', 'a');

INSERT INTO promocja(nazwa, opis, znizka) 
VALUES
    ('ŚWIĘTA', 'Cyber święta z CyberShop już teraz! Tniemy ceny na maksa!', 0.20),
    ('Tydzień smartfonów Xiaomi', 'Przenieś się w nowy wymiar z nowym smartfonem Xiaomi', 0.30);

INSERT INTO kategoria_produktu(nazwa, typ)
VALUES 
    ('Smartfony i smartwatche','Smartfony'),
    ('Smartfony i smartwatche','Smartwatche'),
    ('Smartfony i smartwatche','Akcesoria'),
    ('Laptopy i komputery','Komputery'),
    ('Laptopy i komputery','Laptopy'),
    ('Laptopy i komputery','Akcesoria'),
    ('Podzespoły komputerowe', 'Procesory'),
    ('Podzespoły komputerowe', 'Karty graficzne'),
    ('Podzespoły komputerowe', 'Zasilacze');

INSERT INTO produkt(
    nazwa, 
    opis, 
    cena,
    marza,
    producent,
    okres_gwarancji,
    stan_magazynu,
    promocja,
    kategoria)
VALUES 
    ('Apple iPhone 12‌ mini 128GB (czerwony)', 'Dzwoni', 4799, 0.2, 'Apple', 12, 131, 2,1),
    ('Xiaomi Redmi Note 10 Pro', 'Dzwoni', 799, 0.2, 'Xiaomi', 24, 999, 2,1),
    ('Apple Watch 3 38mm biały', 'Wyświetla godzinę', 9999, 0.2, 'Apple', 12, 123, null, 2),
    ('TestItem1', 'testuje1', 7499, 0.2, 'Testex1', 12, 399, 2,1),
    ('TestItem2', 'testuje2', 729, 0.2, 'Testex2', 24, 949, 1,2),
    ('TestItem3', 'testuje3', 759, 0.2, 'Testex3', 24, 959, 2,4);

INSERT INTO adres( 
    uzytkownik_id,
    panstwo,
    kod_pocztowy,
    miejscowosc,
    ulica,
    nr_budynku,
    nr_lokalu)
VALUES
    (1, 'Polska', '26-600', 'Radom', 'Żeromskiego', '1', '1a'),
    (1, 'Polska', '26-636', 'Radom', 'Piłsudskiego', '2', '2a'),
    (2, 'Polska', '77-737', 'Kraków', 'Krakowska', '7', '2b');


INSERT INTO zamowienie(
    uzytkownik_id,
    adres_id,
    tytul,
    koszt_produktow,
    koszt_dostawy,
    uwagi_klienta)
VALUES
    (1, 1, 'zamowienie 1', 123, 15, 'Miłego dnia :)'),
    (2, 2, 'zamowienie 2', 999, 12, ''),
    (1, 3, 'zamowienie 3', 321, 15, ''),
    (2, 2, 'zamowienie 4', 533, 12, '');

INSERT INTO status_platnosci(
    zamowienie_id,
    czy_zaplacone,
    typ_platnosci)
VALUES
    (1, true, 'przelew'),
    (2, false, 'Blik'),
    (3, true, 'przelew'),
    (4, false, 'Blik');

INSERT INTO pozycja_zamowienia(
    zamowienie_id,
    produkt_id,
    ilosc,
    cena_za_sztuke)
VALUES
    (1, 1, 5, 4799),
    (1, 2, 2, 799),
    (2, 3, 1, 9999),
    (3, 4, 2, 7499),
    (3, 5, 3, 729),
    (4, 6, 2, 759);

INSERT INTO opinia(
    gwiazdki,
    tresc,
    produkt_id,
    autor_id)
VALUES
    ('5', 'Dobry produkt. Moje życie uległo zmianie od kiedy kupiłem ten produkt. Polecam', 2, 1),
    ('3', 'Apple not gut.', 1, 2),
    ('4', '', 2, 2),
    ('1', '', 2, 3),
    ('4', '', 2, 4),
    ('2', '', 1, 1),
    ('5', 'Test Kom', 4, 1),
    ('3', 'Test Kom.', 4, 2),
    ('4', 'test Kom', 5, 2),
    ('1', 'test Kom', 5, 3),
    ('4', 'test Kom', 6, 4),
    ('2', 'test Kom', 6, 1);;

INSERT INTO serwis(pozycja_zamowienia_id, opis_usterki, status, ilosc)
VALUES
    (1,'Nie działa przycisk nr 1.', 'nowe', 1),
    (3,'Bateria do wymiany.','realizowane',1);

UPDATE zamowienie
SET data_zrealizowania = now()
WHERE id=1 OR id=2;
