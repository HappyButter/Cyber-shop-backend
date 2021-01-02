import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;


class OrderStatusController {
    // mapUser = (user) => {
    //     return {
    //         id: user.id,
    //         type: user.typ,
    //         creationDate: user.data_utworzenia,
    //         name: user.imie,
    //         surname: user.nazwisko,
    //         email: user.email,
    //         phoneNumber: user.telefon,
    //         password: user.haslo,
    //     }
    // }

    // getStatus = async (req, res) => {
    //     try{
    //         // const statusI
    //         const status = await pool.query(SQL`
    //             SELECT * FROM status;`
    //         );
    //         const allUsersMapped = allUsers.rows.map(this.mapUser);
            
    //         res.status(200).json(allUsersMapped);
    //     }catch(err){
    //         console.log(err.message);
    //     }
    // }
}

const orderStatusController = new OrderStatusController();
export default orderStatusController;