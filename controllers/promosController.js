import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

class PromosController {

    mapPromo = (promo) => {
        return {
            id: promo.id,
            title: promo.nazwa,
            description: promo.opis,
            discount: parseFloat(promo.znizka), 
        }
    }

    getAllPromos = async (req, res) => {
        try{
            const promos = await pool.query(SQL`
                SELECT * FROM promocja;`
            );

            const promosMapped = promos.rows.map(this.mapPromo);
            
            res.status(200).json(promosMapped);

        }catch(err) {
            console.log(err.message);
        }
    }

    createPromo = async (req, res) => {
        try{
            const { title, description, discount } = req.body;
            const promo = await pool.query(SQL`
                INSERT INTO promocja(nazwa, opis, znizka) 
                VALUES (${title}, ${description}, ${discount})
                RETURNING id;
            `);

            const responseId = { 
                id : promo.rows[0].id,
            }

            res.status(201).json(responseId);

        }catch(err){
            console.log(err.message);
            return res.status(400).send("Niepoprawne dane.");
        }
    }

    updatePromo = async (req, res) => {
        try{
            const id = parseInt(req.params.id);
            const { title, description, discount } = req.body;
            
            const response = await pool.query(SQL`
                UPDATE promocja 
                SET nazwa=${title}, opis=${description}, znizka=${discount}
                WHERE id=${id}
                RETURNING znizka`
            );

            if(response.rows[0].znizka === discount){
                res.status(201).send(`Promo with ID: '${id}' has been modified.`);
            }else{
                res.status(406).send('Niepoprawna wartość zniżki. Wybierz z przedziału (0-1)');
            }
        }catch(err){
            console.log(err.message);
        }
    } 

    deletePromo = async (req, res) => {
        try{
            const id = parseInt(req.params.id);

            const response = await pool.query(SQL`
                DELETE FROM promocja 
                WHERE id=${id};
            `); 
            res.status(200).send(`Promo with ID: ${id} has been deleted.`);
        }catch(err){
            console.log(err.message);
        }
    }
}

const promosController = new PromosController();
export default promosController;