import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

class CategoryController {
    addCategoryType = async (req, res) => {
        try {
            const { categoryName, categoryTypeName } = req.body;

            await pool.query(SQL`
                INSERT INTO kategoria_produktu(nazwa, typ)
                VALUES (${categoryName}, ${categoryTypeName})
                RETURNING id;
            `)

            res.status(201).send("Pomyślnie dodano.")

        }catch(err){
            console.log(err);
        }
    }
    
    getAllCategories = async (req, res) => {
        try {
            const categories = await pool.query(SQL`
                SELECT * FROM kategoria_produktu;
            `);

            res.status(200).json(categories.rows.map(
                cat => ({
                    category_name: cat.nazwa,
                    category_group: cat.typ,
                })))
        }catch(err){
            console.log(err);
        }
    }
}

const categoryController = new CategoryController();
export default categoryController;