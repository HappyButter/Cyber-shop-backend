import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

const categoriesEnum = {
    1 : 'Smartfony i smartwatche',
    2 : 'Laptopy i komputery',
    3 : 'Podzespoły komputerowe'        
}
class ProductsController {
    mapProductShort = (product) => {
        return {
            id: product.id,
            name: product.nazwa,
            price: product.cena,
            promo_price: product.cena_promo,
            rating: product.srednia_ocena,
            inStock: product.stan_magazynu,
            promo_id: product.promocja,
            category_id: product.kategoria,
            category_name: product.nazwa_kategorii,
            category_group: product.typ,
        }
    }

    mapProduct = (product) => {
        return {
            id: product.id,
            name: product.nazwa,
            description: product.opis,
            price: product.cena,
            promo_price: product.cena_promo,
            rating: product.srednia_ocena,
            producer: product.producent,
            warranty: product.okres_gwarancji,
            inStock: product.stan_magazynu,
            promo_id: product.promocja,
            category_id: product.kategoria,
            category_name: product.nazwa_kategorii,
            category_group: product.typ,
        }
    }

    getRecommendedProducts = async (req, res) => {
        try{
            const products = await pool.query(SQL`
                select * from rekomendowane;
            `);
            const productsMapped = products.rows.map(this.mapProductShort);

            res.status(200).json(productsMapped);
        }catch(err) {
            console.log(err.message);
        }
    }

    getAllProductsNames = async (req, res) => {
        try{
            const allProductsNames = await pool.query(SQL`
                SELECT *
                FROM wszystkie_nazwy_produktow;`
            );
            
            const allProductsMapped = allProductsNames.rows.map((product) => ({ 
                name: product.nazwa 
            }));
            
            res.status(200).json(allProductsMapped);
        }catch(err){
            console.log(err.message);
        }
    }

    getProductsByCategoryId = async (req, res) => {        
        try{
            const categoryId = parseInt(req.params.id);
            const categoryName = categoriesEnum[categoryId];

            const products = await pool.query(SQL`
                SELECT * FROM produkt_pelne_info
                WHERE nazwa_kategorii=${categoryName};
            `);

            const productsMapped = products.rows.map(this.mapProductShort);
            res.status(200).json(productsMapped);
        }catch(err){
            console.log(err.message);
        }
    }

    getProductsByPromoId = async (req, res) => {
        try {
            const promoId = parseInt(req.params.id);
            const products = await pool.query(SQL`
                SELECT * FROM produkt_pelne_info
                WHERE promocja=${promoId};
            `);

            const productsMapped = products.rows.map(this.mapProductShort);
            res.status(200).json(productsMapped);
        }catch(err){
            console.log(err.message);
        }
    }

    getProductById = async (req, res) => {
        try {
            const productId = parseInt(req.params.id);
            const product = await pool.query(SQL`
                SELECT * FROM produkt_pelne_info
                WHERE id=${productId};
            `);

            const productMapped = product.rows.map(this.mapProduct);

            res.status(200).json(productMapped);
        }catch(err){
            console.log(err.message);
        }
    }

    createProduct = async (req, res) => {
        try{
            const { name, 
                    description, 
                    price,  
                    producer, 
                    warranty, 
                    inStock, 
                    promo_id, 
                    category_id } = req.body;

                    const product = await pool.query(SQL`
                        INSERT INTO produkt(
                            nazwa, 
                            opis, 
                            cena,
                            producent,
                            okres_gwarancji,
                            stan_magazynu,
                            promocja,
                            kategoria) 
                        VALUES (${name}, 
                                ${description}, 
                                ${price},  
                                ${producer}, 
                                ${warranty}, 
                                ${inStock}, 
                                ${promo_id}, 
                                ${category_id})
                        RETURNING id;
                    `);

                    const responseId = { 
                        id : product.rows[0].id,
                    }
        
                    res.status(201).json(responseId);
        }catch(err){
            console.log(err.message);
            return res.status(400).send("Niepoprawne dane.");
        }
    }

    updateProduct = async (req, res) => {
        try{
            const productId = parseInt(req.params.id);
            const { name, 
                    description, 
                    price,  
                    producer, 
                    warranty, 
                    inStock, 
                    promo_id, 
                    category_id } = req.body;

                    const product = await pool.query(SQL`
                        UPDATE produkt
                        SET
                            nazwa=${name}, 
                            opis=${description}, 
                            cena=${price},
                            producent=${producer},
                            okres_gwarancji=${warranty},
                            stan_magazynu=${inStock},
                            promocja=${promo_id},
                            kategoria=${category_id}
                        WHERE id=${productId} 
                        RETURNING id;
                    `);

                    const id = product.rows[0].id;

                    res.status(201).send(`Product with ID: '${id}' has been modified.`);
        }catch(err){
            console.log(err.message);
            return res.status(400).send("Niepoprawne dane.");
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const productId = parseInt(req.params.id);
            await pool.query(SQL`
                DELETE FROM produkt WHERE id=${productId}; 
            `);

            res.status(200).send('Pomyślnie usunięto.');
        }catch(err){
            console.log(err.message);
        }
    }
}

const productsController = new ProductsController();
export default productsController;