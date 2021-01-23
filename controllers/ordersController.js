import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';
import adressesService from '../services/adressesService.js';
import ordersService from '../services/ordersService.js';

const {SQL} = sqlTemplate;


class OrdersController {
    mapOrder = ( order ) => {
        return {
            order_id : order.zamowienie_id,
            user_id : order.uzytkownik_id,
            orderStatus : order.status_zamowienia,
            title : order.tytul,
            payment_status_id : order.status_platnosci_id,
            address_id : order.adres_id,
            datePlaced : order.data_utworzenia,
            dateFulfillment : order.data_zrealizowania,
            productsCost : order.koszt_produktow,
            shippmentPrice : order.koszt_dostawy,
            clientComments : order.uwagi_klienta,
            isPaid : order.czy_zaplacone,
            paymentMethod : order.typ_platnosci,
            country : order.panstwo,
            postCode : order.kod_pocztowy,
            city : order.miejscowosc,
            street : order.ulica,
            building : order.nr_budynku,
            apartment : order.nr_lokalu
        }   
    }

    mapOrderedProduct = (prod) => {
        return {
            name : prod.nazwa_produktu,
            orderLineId : prod.pozycja_zamowienia_id,
            productId : prod.produkt_id,
            quantity : prod.ilosc,
            pricePerItem : prod.cena_za_sztuke
        }
    }

    updateOrderPaymentStatus = async (req, res) => {
        try {
            const orderId = parseInt(req.params.id);
            const { isPaid } = req.body;
            const result = await pool.query(SQL`
                UPDATE status_platnosci 
                SET czy_zaplacone=${isPaid}
                WHERE zamowienie_id=${orderId}
                RETURNING zamowienie_id;
            `);

            res.status(201).json(result.rows[0].zamowienie_id);
        }catch(err){
            console.log(err);
        }
    }

    updateOrderStatus = async (req, res) => {
        try {
            const orderId = parseInt(req.params.id);
            const { status } = req.body;

            const updatedOrder = await pool.query(SQL`
                UPDATE zamowienie
                SET status=${status}
                WHERE id=${orderId}
                RETURNING *;
            `);

            res.status(201).json(updatedOrder.rows.map(this.mapOrder));
        }catch(err){
            console.log(err);
        }
    }

    getAllOrdersDetails = async (req, res) => {
        try {
            const orders = await pool.query(SQL`
                SELECT * FROM zamowienie_pelne_info;
            `);

            const ordersMapped = orders.rows.map(this.mapOrder);

            for(let order of ordersMapped){
                const productList = await pool.query(SQL`
                    SELECT * FROM zamowione_produkty 
                    WHERE zamowienie_id=${order.order_id};
                `);
                order.productList = productList.rows.map(this.mapOrderedProduct);
            };

            res.status(200).json(ordersMapped);

        }catch(err){
            console.log(err.message);
        }
    }

    getOrdersDetailsByUserId = async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const order = await pool.query(SQL`
                SELECT * FROM zamowienie_pelne_info
                WHERE uzytkownik_id=${userId};
            `);

            const orderMapped = order.rows.map(this.mapOrder);
            res.status(200).json(orderMapped);
        }catch(err){
            console.log(err.message);
        }
    }

    /** składanie zamówienia z użyciem istniejącego adresu dostawy, bądź z dodaniem nowego
     * 
     * przykładaowa składnia zapytania
     * {
        "userId": 2,
        "productsCost": 10, 
        "shippmentPrice": 15, 
        "addressId" : 1,
        "clientComments": " abc",
        "paymentMethod" : "Blik",
        "productList":[ {
                "productId": 1,
                "productName": "aa",
                "price" : 10,
                "quantity": 1
            },
            {...}
        ]
        }
    *  
    * 
    */
    createOrder = async (req, res) => {
        const client = await pool.connect();
        try{
            await client.query(SQL`BEGIN`);
            console.log(req.body);

            // check if user has chosen existing address
            let newAddressId;

            req.body.addressId !== null 
            ? newAddressId = req.body.addressId
            : newAddressId = await adressesService.createAddress(req.body, client);

            const newOrderId = await ordersService.createOrder( {...req.body, addressId : newAddressId }, client);
            await ordersService.createPaymentStatus({...req.body, orderId : newOrderId }, client);
            
            const items = req.body.productList;
            for(const product of items){
                const isSuccess = await ordersService.reduceProductQuantity(product, client);
                if(!isSuccess){  
                    await client.query('ROLLBACK');
                    res.status(409).json({info: "could not reduce product quantity"});
                    return
                }

                await ordersService.createOrderItem({...product, orderId : newOrderId }, client);
            }

            await client.query('COMMIT');
            res.status(201).json({newOrderId});
        } catch(err) {
            await client.query('ROLLBACK');
            console.error(err);
          } finally {
            client.release();
          }
    }

    /** Zmiana stanu magazynowego 
     *   
     * 
     * Przykładowa składnia zapytania:
     *  {
            "userId": 1,
            "title" : "test storage",
            "productsCost" : -20, 
            "shippmentPrice" : 0,
            "productId" : 9,
            "quantity" : 3,
            "price": 10
        }
     *  
     */
    updateStorage = async (req, res) => {
        const client = await pool.connect();
        try{
            await client.query(SQL`BEGIN`);

            const newOrderId = await ordersService.createStorageUpdate( req.body, client);
            
            const isSuccess = await ordersService.reduceProductQuantity(req.body, client);
            if(!isSuccess){  
                await client.query('ROLLBACK');
                res.status(409).json({info: "could not reduce product quantity"});
                return
            }

            await ordersService.createOrderItem({...req.body, orderId : newOrderId }, client);

            await client.query('COMMIT');
            res.status(201).json({newOrderId});
        } catch(err) {
            await client.query('ROLLBACK');
            console.error(err);
          } finally {
            client.release();
          }
    }
}

const ordersController = new OrdersController();
export default ordersController;