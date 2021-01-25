import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

class AddressesService {
    updateAddress = async (adressData, client = pool) => {
        try{
            const {addressId, country, postcode, city, street, building, apartment} = adressData;
            
            const id = await client.query(SQL`
                UPDATE adres 
                SET panstwo=${country}, 
                    kod_pocztowy=${postcode}, 
                    miejscowosc=${city}, 
                    ulica=${street}, 
                    nr_budynku=${building}, 
                    nr_lokalu=${apartment}
                WHERE id = ${addressId}
                RETURNING id;`
            );
   
            return id.rows[0].id;
        }catch(err){
            console.log(err.message);
        }
    } 

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

const addressesService = new AddressesService();
export default addressesService;