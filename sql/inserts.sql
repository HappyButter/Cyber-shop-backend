INSERT INTO uzytkownik(typ, imie, nazwisko, email, telefon, haslo)
VALUES
    ('klient', 'Halina', 'Nowak', 'nowak@email.com', '222-456-789', '123456'),
    ('klient', 'Adam', 'Abacki', 'abacki@email.com', '222-456-719', '123456'),
    ('klient', 'Janusz', 'Kowalski', 'k2owalski@email.com', '+48322456739', 'klient'),
    ('admin', 'Jan', 'Matejko', 'matejko@email.com', '222-456-719', 'admin');

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
    ('Apple iPhone 12‌ mini 128GB (czerwony)', 'Dzwoni', 4799.00, 0.2, 'Apple', 12, 111, 1, 1),
    ('Xiaomi Redmi Note 10 Pro', 'Też dzwoni', 1499.00, 0.2, 'Xiaomi', 24, 322, 2, 1),
    ('Xiaomi Redmi Note 9 Pro 6/128GB Grey', 'Stworzony dla Ciebie aparat do wykonywania świetnych ujęć.', 999.00, 0.2, 'Xiaomi', 12, 399, 2, 1),
    ('Apple Watch 3 38mm biały', 'Wyświetla godzinę', 9999, 0.2, 'Apple', 12, 123, null, 2),
    ('HP Pavilion Gaming i5/32GB/512/Win10x GTX1650Ti 144Hz', 'Dobry do MS Word', 4699.00, 0.2, 'HP', 24, 56, 1, 5),
    ('Intel Core i5‑10400F', 'testuje3', 699, 0.25, 'Intel', 24, 222, null, 7);

INSERT INTO adres(
    uzytkownik_id,
    panstwo,
    kod_pocztowy,
    miejscowosc,
    ulica,
    nr_budynku,
    nr_lokalu)
VALUES
    (4, 'Polska', '26-600', 'Radom', 'Żeromskiego', '1', '1a'),
    (4, 'Polska', '26-636', 'Radom', 'Piłsudskiego', '2', '2a'),
    (1, 'Polska', '77-737', 'Kraków', 'Krakowska', '7', '2b');


INSERT INTO zamowienie(
    uzytkownik_id,
    adres_id,
    tytul,
    koszt_produktow,
    koszt_dostawy,
    uwagi_klienta)
VALUES
    (4, 1, 'Zamówienie nr 1', 123, 15, 'Miłego dnia :)'),
    (4, 2, 'Zamówienie nr 2', 999, 10, ''),
    (1, 3, 'Zamówienie nr 3', 321, 15, ''),
    (1, 3, 'Zamówienie nr 4', 533, 5, '');

INSERT INTO status_platnosci(
    zamowienie_id,
    czy_zaplacone,
    typ_platnosci)
VALUES
    (1, true, 'Karta'),
    (2, false, 'Blik'),
    (3, true, 'Gotówka przy odbiorze'),
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
    nick,
    tresc,
    produkt_id,
    autor_id)
VALUES
    ('5', 'Ciastkowy potwór', 'Dobry produkt. Moje życie uległo zmianie od kiedy kupiłem ten produkt. Polecam', 2, 1),
    ('3', 'Ciastkowy potwór', 'Apple not gut.', 1, 2),
    ('4', 'Roman', 'Ok', 2, 2),
    ('1', 'Andrzej', 'polecam', 2, 3),
    ('4', 'Butter', 'kiepsko', 2, 4),
    ('2', 'Luks', 'Luks', 1, 1),
    ('5', 'Luks', 'Test Kom 1', 4, 1),
    ('3', 'Luks', 'Test Kom 2', 4, 2),
    ('4', 'Luks', 'test Kom 3', 5, 2),
    ('1', 'Luks', 'test Kom 4', 5, 3),
    ('4', 'Orangutan', 'test Kom 5', 6, 4),
    ('2', 'Luks', 'test Kom 6', 6, 1);

UPDATE zamowienie
SET status = 'zrealizowane'
WHERE id=1 OR id=3;

INSERT INTO serwis(pozycja_zamowienia_id, opis_usterki, status)
VALUES
    (1, 'Nie działa przycisk nr 1.', 'nowe'),
    (4, 'Bateria do wymiany.','realizowane');