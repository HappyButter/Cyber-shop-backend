import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

class OrdersService {
    createOrder = async ( orderData, client = pool ) => {
        try{
            const { userId, addressId, title, productsCost, shippmentPrice, clientComments } = orderData;

            const newOrderId = await client.query(SQL`
                INSERT INTO zamowienie( 
                    uzytkownik_id,
                    adres_id,
                    tytul,
                    koszt_produktow,
                    koszt_dostawy,
                    uwagi_klienta)
                VALUES
                    (   ${userId}, 
                        ${addressId}, 
                        ${title},
                        ${productsCost}, 
                        ${shippmentPrice}, 
                        ${clientComments}   )
                RETURNING id;`
            );
        
            return newOrderId.rows[0].id;
        }catch(err){
            console.log(err.message);
        }
    }
    
    createPaymentStatus = async ( paymentData, client = pool ) => {
        try{
            const { orderId, paymentMethod } = paymentData;

            const newPaymentId = await client.query(SQL`
                INSERT INTO status_platnosci( 
                    zamowienie_id,
                    typ_platnosci)
                VALUES
                    (   ${orderId}, 
                        ${paymentMethod} )
                RETURNING id;`
            );
        
            return newPaymentId.rows[0].id;
        }catch(err){
            console.log(err.message);
        }
    }

    createOrderItem = async ( orderItemData, client = pool) => {
        try{
            const { orderId, productId, quantity, price } = orderItemData;

            const newOrderItemId = await client.query(SQL`
                INSERT INTO pozycja_zamowienia( 
                    zamowienie_id,
                    produkt_id,
                    ilosc,
                    cena_za_sztuke)
                VALUES
                    (   ${orderId}, 
                        ${productId}, 
                        ${Math.abs(quantity)},
                        ${price}    )
                RETURNING id;`
            );
        
            return newOrderItemId.rows[0].id;
        }catch(err){
            console.log(err.message);
        }
    }

    reduceProductQuantity = async ( orderItemData, client = pool ) => {
        try{
            const { id, quantity } = orderItemData;

            const inStockBefore = await client.query(SQL`
                SELECT stan_magazynu FROM produkt 
                WHERE id=${id};
            `);

            const inStockAfter = await client.query(SQL`
                UPDATE produkt 
                SET stan_magazynu=stan_magazynu - ${quantity}
                WHERE id=${id}
                RETURNING stan_magazynu;
            `);

            return !(inStockBefore.rows[0].stan_magazynu === inStockAfter.rows[0].stan_magazynu);
        }catch(err){
            console.log(err.message);
        }
    }

    createStorageUpdate = async ( orderData, client = pool ) => {
        try{
            const { userId, title, productsCost, shippmentPrice } = orderData;

            const newOrderId = await client.query(SQL`
                INSERT INTO zamowienie( 
                    uzytkownik_id,
                    tytul,
                    koszt_produktow,
                    koszt_dostawy)
                VALUES
                    (   ${userId}, 
                        ${title}, 
                        ${productsCost}, 
                        ${shippmentPrice}   )
                RETURNING id;`
            );
        
            return newOrderId.rows[0].id;
        }catch(err){
            console.log(err.message);
        }
    }
}

const ordersService = new OrdersService();
export default ordersService;