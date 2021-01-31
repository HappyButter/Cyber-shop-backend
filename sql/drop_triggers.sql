DROP TRIGGER promo_cena ON produkt;
DROP FUNCTION IF EXISTS zmodyfikuj_promo_cena();

DROP TRIGGER srednia_ocena ON opinia;
DROP FUNCTION IF EXISTS zmodyfikuj_srednia_ocena();

DROP TRIGGER promocja_update_cena ON promocja;
DROP FUNCTION IF EXISTS promocja_update_cena();

DROP TRIGGER promocja_update ON promocja;
DROP FUNCTION IF EXISTS promocja_update();

DROP TRIGGER promocja_delete ON promocja;
DROP FUNCTION IF EXISTS promocja_delete();

DROP TRIGGER sprawdz_aktywnosc_gwarancji ON promocja;
DROP FUNCTION IF EXISTS sprawdz_aktywnosc_gwarancji();

DROP TRIGGER sprawdz_ilosc_produktow_w_serwisie ON promocja;
DROP FUNCTION IF EXISTS sprawdz_ilosc_produktow_w_serwisie();

DROP TRIGGER aktualizuj_data_zrealizowania ON promocja;
DROP FUNCTION IF EXISTS aktualizuj_data_zrealizowania();
