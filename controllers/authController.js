import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;


class AuthController {

    register = async (req, res) => {
        try{
            const { name, surname, phoneNumber, email, password } = req.body;
            
            const user = await pool.query(SQL`
                INSERT INTO uzytkownik(imie, nazwisko, email, telefon, haslo)
                VALUES 
                    (${name}, ${surname}, ${email}, ${phoneNumber}, ${password})
                RETURNING id, imie;
            `);

            const newUser = { 
                id : user.rows[0].id,
                name : user.rows[0].imie,
                surname : user.rows[0].nazwisko,
                phoneNumber : user.rows[0].telefon
            }

            res.status(201).json(newUser);

        }catch(err){
            console.log(err.message);
            return res.status(400).send("Wybierz inny adres email.");
        }
    }

    login = async (req, res) => {
        try{
            const { email, password } = req.body;
            const user = await pool.query(SQL`
                SELECT * FROM uzytkownik 
                WHERE email=${email} AND haslo=${password};`
            );

            if(user.rows.length === 0){
                return res.status(400).send("Nie znaleziono użytkownika.");
            }

            const userMapped = {
                isAdmin : user.rows[0].typ === 'admin',
                id : user.rows[0].id,
                name : user.rows[0].imie,
                surname : user.rows[0].nazwisko,
                phoneNumber : user.rows[0].telefon
            };
            res.status(200).send(userMapped);

        }catch(err){
            console.log(err.message);
        }
    }
}

const authController = new AuthController();

export default authController;