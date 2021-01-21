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
  "nr_budynku" varchar(5) NOT NULL,
  "nr_lokalu" varchar(5)
);

CREATE TABLE "uzytkownik" (
  "id" SERIAL PRIMARY KEY,
  "typ" typ_uzytkownia NOT NULL DEFAULT 'klient',
  "data_utworzenia" timestamp DEFAULT (now()),
  "imie" varchar NOT NULL,
  "nazwisko" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "telefon" varchar(15) NOT NULL,
  "haslo" varchar(50) NOT NULL
);

CREATE TABLE "status_platnosci" (
  "id" SERIAL PRIMARY KEY,
  "zamowienie_id" int,
  "czy_zaplacone" boolean NOT NULL DEFAULT false,
  "typ_platnosci" varchar NOT NULL,
  "tytul" varchar
);

CREATE TABLE "zamowienie" (
  "id" SERIAL PRIMARY KEY,
  "uzytkownik_id" int,
  "adres_id" int,
  "status" status_zamowienia DEFAULT 'nowe',
  "data_utworzenia" timestamp DEFAULT (now()),
  "data_zrealizowania" timestamp DEFAULT null,
  "koszt_produktow" float NOT NULL,
  "koszt_dostawy" float NOT NULL,
  "uwagi_klienta" varchar DEFAULT null
);

CREATE TABLE "pozycja_zamowienia" (
  "id" SERIAL PRIMARY KEY,
  "zamowienie_id" int,
  "produkt_id" int,
  "ilosc" int NOT NULL
);

CREATE TABLE "serwis" (
  "id" SERIAL PRIMARY KEY,
  "pozycja_zamowienia_id" int,
  "opis_usterki" varchar,
  "status" varchar,
  "ilosc" int
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
  "cena" float NOT NULL,
  "cena_promo" float DEFAULT null,
  "srednia_ocena" float DEFAULT null,
  "producent" varchar NOT NULL,
  "okres_gwarancji" int NOT NULL,
  "stan_magazynu" int DEFAULT 0,
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
  "znizka" float NOT NULL DEFAULT 0
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
