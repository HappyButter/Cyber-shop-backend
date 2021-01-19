import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;


class UsersController {

    mapUser = (user) => {
        return {
            id: user.id,
            type: user.typ,
            creationDate: user.data_utworzenia,
            name: user.imie,
            surname: user.nazwisko,
            email: user.email,
            phoneNumber: user.telefon,
            password: user.haslo,
        }
    }

    getAllUsers = async (req, res) => {
        try{
            const allUsers = await pool.query(SQL`
                SELECT * FROM uzytkownik;`
            );
            const allUsersMapped = allUsers.rows.map(this.mapUser);
            
            res.status(200).json(allUsersMapped);
        }catch(err){
            console.log(err.message);
        }
    }

    getUserByID = async (req, res) => {
        try{
            const id = parseInt(req.params.id);
            const user = await pool.query(SQL`
                SELECT * FROM uzytkownik 
                WHERE id=${id};`);

            const userMapped = this.mapUser(user.rows[0]);
            res.status(200).json(userMapped);
        }catch(err){
            console.log(err.message);
        }
    }
    
    updateUser = async (req, res) => {
        try{
            const id = parseInt(req.params.id);
            const {name, surname, phoneNumber} = req.body;
            
            await pool.query(SQL`
                UPDATE uzytkownik 
                SET imie=${name},
                    nazwisko = ${surname},
                    telefon=${phoneNumber} 
                WHERE id = ${id}`
            );

            res.status(200).send(`User modified with ID: ${id}`)
        }catch(err){
            console.log(err.message);
        }
    } 
  
    deleteUser = async (req, res) => {
        try{
            const id = parseInt(req.params.id);

            await pool.query(SQL`
                DELETE FROM uzytkownik 
                WHERE id = ${id}`
            );

            res.status(200).send(`User deleted with ID: ${id}`)
        }catch(err){
            console.log(err.message);
        }
    } 

}

const usersController = new UsersController();

export default usersController;