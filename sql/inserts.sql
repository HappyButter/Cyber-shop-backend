INSERT INTO uzytkownik(typ, imie, nazwisko, email, telefon, haslo)
VALUES 
    ('klient', 'Adrian', 'Fórman', 'forman@email.com', '+48222456789', '123456'),
    ('klient', 'Roman', 'Jarosiński', 'jarosinski@email.com', '+48222456719', '123456'),
    ('admin', 'Kasia', 'Jasia', 'jasia@email.com', '+48222456719', 'admin');

INSERT INTO promocja(nazwa, opis, znizka) 
VALUES
    ('ŚWIĘTA', 'Cyber święta z CyberShop już teraz! Tniemy ceny na maksa!', 0.80),
    ('Tydzień smartfonów Xiaomi', 'Przenieś się w nowy wymiar z nowym smartfonem Xiaomi', 0.70);

INSERT INTO kategoria_produktu(kategoria, grupa)
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
    producent,
    okres_gwarancji,
    stan_magazynu,
    promocja,
    kategoria)
VALUES 
    ('Apple iPhone 12‌ mini 128GB (czerwony)', 'Dzwoni', 4799, 'Apple', 12, 131, 2,1),

    ('Xiaomi Redmi Note 10 Pro', 'Dzwoni', 799, 'Xiaomi', 24, 999, 2,1),
    
    ('Apple Watch 3 38mm biały', 'Wyświetla godzinę', 9999, 'Apple', 12, 123, null, 2);

INSERT INTO adres( 
    uzytkownik_id,
    panstwo,
    kod_pocztowy,
    miejscowosc,
    ulica,
    nr_budynku,
    nr_lokalu)
VALUES
    (3, 'Polska', '26-600', 'Radom', 'Żeromskiego', '1', '1a'),
    (3, 'Polska', '26-636', 'Radom', 'Piłsudskiego', '2', '2a'),
    (4, 'Polska', '77-737', 'Kraków', 'Krakowska', '7', '2b');
    
INSERT INTO status(stan, uwagi)
VALUES 
    ('nowe', ''),
    ('pakowane', 'Proszę o solidne zapakowanie');

INSERT INTO zamowienie(  
    uzytkownik_id,
    status_id,
    adres_id,
    uwagi_klienta)
VALUES
    (3, 1, 1, 'Miłego dnia :)'),
    (3, 2, 2, '');

INSERT INTO pozycja_zamowienia(  
    zamowienie_id,
    produkt_id,
    ilosc)
VALUES
    (1, 1, 5),
    (1, 2, 2),
    (2, 3, 1);

INSERT INTO opinia(
    gwiazdki,
    tresc, 
    produkt_id,
    autor_id)
VALUES
    ('5', 'Dobry produkt. Moje życie uległo zmianie od kiedy kupiłem ten produkt. Polecam', 2, 3),
    ('3', 'Apple not gut.', 1, 3);
