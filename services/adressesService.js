import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

class AdressesService {
    createAddress = async ( adressData, client = pool ) => {
        try{
            const { userId, country, postcode, city, street, building, apartment } = adressData;

            const newAddressID = await client.query(SQL`
                INSERT INTO adres( 
                    uzytkownik_id,
                    panstwo,
                    kod_pocztowy,
                    miejscowosc,
                    ulica,
                    nr_budynku,
                    nr_lokalu)
                VALUES
                    (   ${userId}, 
                        ${country}, 
                        ${postcode}, 
                        ${city}, 
                        ${street}, 
                        ${building}, 
                        ${apartment}    )
                    RETURNING id;`
            );
        
            return newAddressID.rows[0].id;
        }catch(err){
            console.log(err.message);
        }
    } 
}

const adressesService = new AdressesService();
export default adressesService;