import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

class OrdersService {
    createOrder = async ( orderData, client = pool ) => {
        try{
            const { userId, adressId, productsCost, shipmentPrice, clientComments } = orderData;

            const newOrderId = await client.query(SQL`
                INSERT INTO zamowienie( 
                    uzytkownik_id,
                    adres_id,
                    koszt_produktow,
                    koszt_dostawy,
                    uwagi_klienta)
                VALUES
                    (   ${userId}, 
                        ${adressId}, 
                        ${productsCost}, 
                        ${shipmentPrice}, 
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
            const { orderId, isPaid, paymentMethod, title } = paymentData;

            const newPaymentId = await client.query(SQL`
                INSERT INTO status_platnosci( 
                    zamowienie_id,
                    czy_zaplacone,
                    typ_platnosci,
                    tytul)
                VALUES
                    (   ${orderId}, 
                        ${isPaid}, 
                        ${paymentMethod}, 
                        ${title}  )
                RETURNING id;`
            );
        
            return newPaymentId.rows[0].id;
        }catch(err){
            console.log(err.message);
        }
    }

    createOrderItem = async ( orderItemData, client = pool) => {
        try{
            const { orderId, productId, quantity } = orderItemData;

            const newOrderItemId = await client.query(SQL`
                INSERT INTO pozycja_zamowienia( 
                    zamowienie_id,
                    produkt_id,
                    ilosc)
                VALUES
                    (   ${orderId}, 
                        ${productId}, 
                        ${quantity}     )
                RETURNING id;`
            );
        
            return newOrderItemId.rows[0].id;
        }catch(err){
            console.log(err.message);
        }
    }

    reduceProductQuantity = async ( orderItemData, client = pool ) => {
        try{
            const { productId, quantity } = orderItemData;
            
            await client.query(SQL`
                UPDATE produkt 
                SET stan_magazynu=stan_magazynu - ${quantity}
                WHERE id=${productId};
            `);
        }catch(err){
            console.log(err.message);
        }
    }
}

const ordersService = new OrdersService();
export default ordersService;