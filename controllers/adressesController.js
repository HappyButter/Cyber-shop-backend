import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';
import adressesService from '../services/adressesService.js';

const {SQL} = sqlTemplate;


class AdressesController {
    mapAddress = (address) => {
        return {
            id: address.id,
            user_id: address.uzytkownik_id,
            country: address.panstwo,
            postcode: address.kod_pocztowy,
            city: address.miejscowosc,
            street: address.ulica,
            building: address.nr_budynku,
            apartment: address.nr_lokalu,
        }
    } 

    getUserAddresses = async (req, res) => {
        try{
            const userId = parseInt(req.params.id);
            const allAdresses = await pool.query(SQL`
                SELECT * FROM adres 
                WHERE uzytkownik_id=${userId};`
            );

            const allAdressesMapped = allAdresses.rows.map(this.mapAddress);
            res.status(200).send(allAdressesMapped);
        }catch(err){
            console.log(err.message);
        }
    }

    getOrderAddress = async (req, res) => {
        try{
            const orderId = parseInt(req.params.id);
            const address = await pool.query(SQL`
                SELECT * FROM adres
                WHERE id=(SELECT adres_id FROM zamowienie WHERE id=${orderId});`
            );

            const addressMapped = this.mapAddress(address.rows[0]);
            res.status(200).send(addressMapped);
        }catch(err){
            console.log(err.message);
        }
    }

    createAddress = async (req, res) => {
        try{
            const newAddressID = await adressesService.createAddress(req.body);

            res.status(201).send(`Address added with ID: ${newAddressID}`);
        }catch(err){
            console.log(err.message);
        }
    } 
    
    updateAddress = async (req, res) => {
        try{
            const addressId = parseInt(req.params.id)
            const {country, postcode, city, street, building, apartment} = req.body;
            
            await pool.query(SQL`
                UPDATE adres 
                SET panstwo=${country}, 
                    kod_pocztowy=${postcode}, 
                    miejscowosc=${city}, 
                    ulica=${street}, 
                    nr_budynku=${building}, 
                    nr_lokalu=${apartment}
                WHERE id = ${addressId}`
            );

            res.status(200).send(`Address modified with ID: ${id}`)
        }catch(err){
            console.log(err.message);
        }
    } 
  
    deleteAddress = async (req, res) => {
        try{
            const id = parseInt(req.params.id);

            await pool.query(SQL`
                DELETE FROM address 
                WHERE id = ${id}`
            );

            res.status(200).send(`Address deleted with ID: ${id}`)
        }catch(err){
            console.log(err.message);
        }
    } 
}

const adressesController = new AdressesController();
export default adressesController;