SELECT pz.ilosc, p.cena, p.nazwa, p.id FROM pozycja_zamowienia pz
    RIGHT JOIN produkt p on pz.produkt_id = p.id WHERE pz.zamowienie_id=1;