import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

const categoriesEnum = {
    1 : 'Laptopy i komputery',
    2 : 'Smartfony i smartwatche',
    3 : 'Podzespoły komputerowe'        
}
class ProductsController {
    mapProductShort = (product) => {
        return {
            id: product.id,
            name: product.nazwa,
            price: product.cena,
            price: parseFloat(product.cena),
            promo_price: parseFloat(product.cena_promo),
            rating: parseFloat(product.srednia_ocena),
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
            price: parseFloat(product.cena),
            profit_margin: parseFloat(product.marza),
            promo_price: parseFloat(product.cena_promo),
            rating: parseFloat(product.srednia_ocena),
            producer: product.producent,
            warranty: product.okres_gwarancji,
            inStock: parseInt(product.stan_magazynu),
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

    // unused
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
                SELECT * FROM produkt_pelne_info_z_marza
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
                SELECT * FROM produkt_pelne_info_z_marza
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
                SELECT * FROM produkt_pelne_info_z_marza
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
                    profitMargin,  
                    producer, 
                    warranty, 
                    promo_id, 
                    category_id } = req.body;

            const newProductId = await pool.query(SQL`
                INSERT INTO produkt(
                    nazwa, 
                    opis, 
                    cena,
                    marza,
                    producent,
                    okres_gwarancji,
                    promocja,
                    kategoria) 
                VALUES (${name}, 
                        ${description}, 
                        ${price},
                        ${profitMargin},  
                        ${producer}, 
                        ${warranty}, 
                        ${promo_id}, 
                        ${category_id})
                RETURNING id;
            `);

            const productId = newProductId.rows[0].id;
            
            const product = await pool.query(SQL`
                SELECT * FROM produkt_pelne_info
                WHERE id=${productId};
            `);

            const productMapped = product.rows.map(this.mapProduct);

            res.status(200).json(productMapped);
        }catch(err){
            console.log(err.message);
            return res.status(400).send("Niepoprawne dane.");
        }
    }

    updateProductDetails = async (req, res) => {
        try{
            const productId = parseInt(req.params.id);
            const { name, 
                    description, 
                    price,
                    profitMargin,  
                    producer, 
                    warranty, 
                    promo_id, 
                    category_id } = req.body;

            const newProductId = await pool.query(SQL`
                UPDATE produkt
                SET
                    nazwa=${name}, 
                    opis=${description}, 
                    cena=${price},
                    marza=${profitMargin},
                    producent=${producer},
                    okres_gwarancji=${warranty},
                    promocja=${promo_id},
                    kategoria=${category_id}
                WHERE id=${productId} 
                RETURNING id;
            `);

            const id = newProductId.rows[0].id;

            const product = await pool.query(SQL`
                SELECT * FROM produkt_pelne_info
                WHERE id=${id};
            `);

            const productMapped = product.rows.map(this.mapProduct);
            res.status(200).json(productMapped);
        }catch(err){
            console.log(err.message);
            return res.status(400).send("Niepoprawne dane.");
        }
    }   
    
    getAllProductsForManagement = async (req, res) => {
        try{
            const products = await pool.query(SQL`
                SELECT * FROM produkt_pelne_info;
            `);
            
            const productsMapped = products.rows.map(this.mapProduct);
            res.status(200).json(productsMapped);
        }catch(err){
            console.log(err);
        }
    }
}

const productsController = new ProductsController();
export default productsController;