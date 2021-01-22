import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

class ProductServiceController {
    mapService = (service) => {
        return {
            id : service.id,
            orderLineId : service.pozycja_zamowienia_id,
            description : service.opis_usterki,
            status : service.status
        }
    }

    mapServiceFullInfo = (service) => {
        return { 
            id : service.id_serwis,
            description : service.opis_usterki,
            status : service.status,
            productName : service.nazwa,
            dateOrderFulfillment : service.data_zrealizowania_zamowienia,
            producer : service.producent,
            inStock : service.stan_magazynu,
            orderId : service.id_zamowienia,
            productId : service.id_produktu,
            orderLineId : service.id_pozycja_zamowienia,
        }
    }

    getProductsInService = async (req, res) => {
        try { 
            const service = await pool.query(SQL`
                SELECT * FROM produkty_w_serwisie;
            `)

            res.status(200).json(service.rows.map(this.mapServiceFullInfo));
        }catch(err){
            console.log(err);
        }
    }

    addProductInService = async (req, res) => {
        try { 
            const { orderLineId, description, status } = req.body;

            const service = await pool.query(SQL`
                INSERT INTO serwis(pozycja_zamowienia_id, opis_usterki, status)
                VALUES (${orderLineId}, ${description}, ${status})
                RETURNING *;
            `)

            res.status(201).json(service.rows.map(this.mapService));

        }catch(err){
            console.log(err);
        }
    }

    updateProductInService = async (req, res) => {
        try { 
            const { serviceId, description, status } = req.body;

            const service = await pool.query(SQL`
                UPDATE serwis
                SET opis_usterki=${description},
                    status=${status}
                WHERE id=${serviceId}
                RETURNING *;
            `)

            res.status(201).json(service.rows.map(this.mapService));
            
        }catch(err){
            console.log(err);
        }
    }
}

const productServiceController = new ProductServiceController();
export default productServiceController;