import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

const categoriesEnum = {
    1 : 'Smartfony i smartwatche',
    2 : 'Laptopy i komputery',
    3 : 'Podzespoły komputerowe'        
}

class ProductsController {

    mapProduct = (product) => {
        return {
            id: product.id,
            name: product.nazwa,
            description: product.opis,
            price: product.cena,
            producer: product.producent,
            warranty: product.okres_gwarancji,
            inStock: product.stan_magazynu,
            sale_id: product.promocja,
            category_id: product.kategoria, 
        }
    }

    getAllProducts = async (req, res) => {
        try{
            const allProducts = await pool.query(SQL`
                SELECT t.*
                FROM produkt t;`
            );
            const allProductsMapped = allProducts.rows.map(this.mapProduct);
            
            res.status(200).json(allProductsMapped);
        }catch(err){
            console.log(err.message);
        }
    }

    getProductsByCategoryName = async (req, res) => {
        try{
            const categoryId = parseInt(req.params.categoryId);
            const categoryName = categoriesEnum(categoryId);
            const products = await pool.query(SQL`
            SELECT  t.*,
                    kp.nazwa as nazwa_kategorii,
                    kp.typ as typ_kategorii
            FROM produkt t
                LEFT JOIN kategoria_produktu kp 
                    ON t.kategoria = kp.id
                    WHERE kp.nazwa=${categoryName};`);

            const userMapped = this.mapUser(user.rows[0]);
            res.status(200).send(userMapped);
        }catch(err){
            console.log(err.message);
        }
    }

    // createUser = async (req, res) => {
    //     try{
    //         const {type, name, surname, email, phoneNumber, passwd} = req.body;

    //         const newUserID = await pool.query(SQL`
    //             INSERT INTO uzytkownik(typ, imie, nazwisko, email,  telefon, haslo)
    //             VALUES (${type}, ${name}, ${surname}, ${email}, ${phoneNumber}, ${passwd})
    //             RETURNING id;`
    //         );
        
    //         res.status(201).send(`User added with ID: ${newUserID.rows[0].id}`);
    //     }catch(err){
    //         console.log(err.message);
    //     }
    // } 
    
    // updateUser = async (req, res) => {
    //     try{
    //         const id = parseInt(req.params.id);
    //         const {name, surname, email, phoneNumber} = req.body;
            
    //         await pool.query(SQL`
    //             UPDATE uzytkownik 
    //             SET imie=${name}, nazwisko = ${surname}, email = ${email}, telefon=${phoneNumber} 
    //             WHERE id = ${id}`
    //         );

    //         res.status(200).send(`User modified with ID: ${id}`)
    //     }catch(err){
    //         console.log(err.message);
    //     }
    // } 
  
    // deleteUser = async (req, res) => {
    //     try{
    //         const id = parseInt(req.params.id);

    //         await pool.query(SQL`
    //             DELETE FROM uzytkownik 
    //             WHERE id = ${id}`
    //         );

    //         res.status(200).send(`User deleted with ID: ${id}`)
    //     }catch(err){
    //         console.log(err.message);
    //     }
    // } 
}

const productsController = new ProductsController();
export default productsController;