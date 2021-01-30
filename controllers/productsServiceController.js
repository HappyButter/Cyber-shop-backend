import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

class ProductServiceController {
    
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
            orderTitle : service.tytul_zamowienia,
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

            if(service.rows.length !== 0 ){
                const productInService = await pool.query(SQL`
                    SELECT * FROM produkty_w_serwisie
                    WHERE id_serwis=${service.rows[0].id};
                `);

                res.status(201).json(productInService.rows.map(this.mapServiceFullInfo));
            }else{
                res.status(409).json({message:"Something went wrong"});
            }
        

        }catch(err){
            console.log(err);
            res.status(400).send("Bad request");
        }
    }

    updateProductInService = async (req, res) => {
        try { 
            const serviceId = req.params.id;
            const { description, status } = req.body;

            const service = await pool.query(SQL`
                UPDATE serwis
                SET opis_usterki=${description},
                    status=${status}
                WHERE id=${serviceId}
                RETURNING *;
            `)

            if(service.rows.length !== 0 ){
                const productInService = await pool.query(SQL`
                    SELECT * FROM produkty_w_serwisie
                    WHERE id_serwis=${service.rows[0].id};
                `);

                res.status(201).json(productInService.rows.map(this.mapServiceFullInfo));
            }else{
                res.status(409).json("Something went wrong");
            }

        }catch(err){
            console.log(err);
            res.status(400).send("Bad request");
        }
    }
}

const productServiceController = new ProductServiceController();
export default productServiceController;