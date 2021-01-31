CREATE TYPE "typ_uzytkownia" AS ENUM (
  'admin',
  'klient'
);

CREATE TYPE "status_zamowienia" AS ENUM (
  'nowe',
  'przyjete',
  'pakowane',
  'wyslane',
  'zrealizowane',
  'anulowane'
);

CREATE TYPE "gwiazdki" AS ENUM (
  '1',
  '2',
  '3',
  '4',
  '5'
);

CREATE TABLE "adres" (
  "id" SERIAL PRIMARY KEY,
  "uzytkownik_id" int,
  "panstwo" varchar NOT NULL,
  "kod_pocztowy" varchar NOT NULL,
  "miejscowosc" varchar NOT NULL,
  "ulica" varchar NOT NULL,
  "nr_budynku" varchar(5) NOT NULL, -- nie jest o liczba gdyż może pojawić się adres np. "23b" 
  "nr_lokalu" varchar(5)            -- nie jest o liczba gdyż może pojawić się adres np. "23b" 
);

CREATE TABLE "uzytkownik" (
  "id" SERIAL PRIMARY KEY,
  "typ" typ_uzytkownia NOT NULL DEFAULT 'klient', -- dostęp do wszystkich funkcjonalności serwisu ma jedynie admin
  "data_utworzenia" timestamp DEFAULT (now()),
  "imie" varchar NOT NULL,
  "nazwisko" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "telefon" varchar(15) NOT NULL,                 -- format: "123-123-123" - stąd varchar zamiast number
  "haslo" varchar(50) NOT NULL
);

CREATE TABLE "status_platnosci" (
  "id" SERIAL PRIMARY KEY,
  "zamowienie_id" int,
  "czy_zaplacone" boolean NOT NULL DEFAULT false,
  "typ_platnosci" varchar NOT NULL
);

CREATE TABLE "zamowienie" (
  "id" SERIAL PRIMARY KEY,
  "uzytkownik_id" int,
  "adres_id" int,
  "tytul" varchar,
  "status" status_zamowienia DEFAULT 'nowe',
  "data_utworzenia" timestamp DEFAULT (now()),
  "data_zrealizowania" timestamp DEFAULT null,
  "koszt_produktow" numeric(20,2) NOT NULL,
  "koszt_dostawy" numeric(7,2) NOT NULL,
  "metoda_dostawy" varchar(30) DEFAULT '',
  "uwagi_klienta" varchar DEFAULT null
);

CREATE TABLE "pozycja_zamowienia" (
  "id" SERIAL PRIMARY KEY,
  "zamowienie_id" int,
  "produkt_id" int,
  "ilosc" int NOT NULL,                     -- ilosc sztuk zamawianego produktu
  "cena_za_sztuke" numeric(15,2) NOT NULL   -- aktualna cena za sztukę w momencie zakupu produktu.
                                            -- To proste zabezpieczenie by utrzymać spójność w finansach sklepu
);

CREATE TABLE "serwis" (
  "id" SERIAL PRIMARY KEY,
  "pozycja_zamowienia_id" int,
  "opis_usterki" varchar,
  "status" varchar
);

CREATE TABLE "kategoria_produktu" (
  "id" SERIAL PRIMARY KEY,
  "nazwa" varchar(50) NOT NULL,
  "typ" varchar(50) NOT NULL
);

CREATE TABLE "produkt" (
  "id" SERIAL PRIMARY KEY,
  "nazwa" varchar NOT NULL,
  "opis" varchar,
  "cena" numeric(15,2) NOT NULL,
  "marza" numeric(3,2) NOT NULL,              -- marża sklepu. Klientowi wyświetlana jest jedynie cena z narzuconą marżą, 
                                              -- a admin dostaje pełną informację i kontrolę ceny.
                                              -- marza * 100% = procentowa wartość marży
  "cena_promo" numeric(15,2) DEFAULT null,
  "srednia_ocena" numeric(2,1) DEFAULT null,  -- srednia ocena produktu wyliczana na podstawie wszystkich ocen produktu.
                                              -- Gdy produkt jest w grupie 6 najlepiej ocenianych wówczas trafi do widoku 'rekomendowane' 
                                              -- i wyświetli się na głównej stronie
  "producent" varchar NOT NULL,
  "okres_gwarancji" int NOT NULL,             
  "stan_magazynu" int DEFAULT 0,              -- minimum 0
  "promocja" int,
  "kategoria" int NOT NULL
);

CREATE TABLE "opinia" (
  "id" SERIAL PRIMARY KEY,
  "nick" varchar(20),
  "gwiazdki" gwiazdki NOT NULL,
  "tresc" varchar,
  "produkt_id" int,
  "autor_id" int
);

CREATE TABLE "promocja" (
  "id" SERIAL PRIMARY KEY,
  "nazwa" varchar NOT NULL,
  "opis" varchar,
  "znizka" numeric(3,2) NOT NULL DEFAULT 0  -- znizka * 100% = procentowa wartość zniżki
);

ALTER TABLE "adres" ADD FOREIGN KEY ("uzytkownik_id") REFERENCES "uzytkownik" ("id");

ALTER TABLE "status_platnosci" ADD FOREIGN KEY ("zamowienie_id") REFERENCES "zamowienie" ("id");

ALTER TABLE "zamowienie" ADD FOREIGN KEY ("uzytkownik_id") REFERENCES "uzytkownik" ("id");

ALTER TABLE "zamowienie" ADD FOREIGN KEY ("adres_id") REFERENCES "adres" ("id");

ALTER TABLE "pozycja_zamowienia" ADD FOREIGN KEY ("zamowienie_id") REFERENCES "zamowienie" ("id");

ALTER TABLE "pozycja_zamowienia" ADD FOREIGN KEY ("produkt_id") REFERENCES "produkt" ("id");

ALTER TABLE "serwis" ADD FOREIGN KEY ("pozycja_zamowienia_id") REFERENCES "pozycja_zamowienia" ("id");

ALTER TABLE "produkt" ADD FOREIGN KEY ("promocja") REFERENCES "promocja" ("id");

ALTER TABLE "produkt" ADD FOREIGN KEY ("kategoria") REFERENCES "kategoria_produktu" ("id");

ALTER TABLE "opinia" ADD FOREIGN KEY ("produkt_id") REFERENCES "produkt" ("id");

ALTER TABLE "opinia" ADD FOREIGN KEY ("autor_id") REFERENCES "uzytkownik" ("id");
