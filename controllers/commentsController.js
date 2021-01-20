import pool from '../db/db.js';
import sqlTemplate from 'sql-template-strings';

const {SQL} = sqlTemplate;

class CommentsController {

    mapComment = (comment) => {
        return {
            id: comment.id,
            nick: comment.nick,
            stars: comment.gwiazdki,
            description: comment.tresc,
            product_id: comment.produkt_id,
            author_id: comment.autor_id, 
        }
    }

    getCommentsByProductId = async (req, res) => {
        try{
            const productId = parseInt(req.params.id); 
            const comments = await pool.query(SQL`
                SELECT * FROM opinia
                WHERE produkt_id=${productId};`
            );

            const commentsMapped = comments.rows.map(this.mapComment);
            
            res.status(200).json(commentsMapped);

        }catch(err) {
            console.log("tutaj");
            console.log(err);
        }
    }

    createComment = async (req, res) => {
        try{
            const { nick, stars, description, productId, authorId } = req.body;
            const comment = await pool.query(SQL`
                INSERT INTO opinia(nick, gwiazdki, tresc, produkt_id, autor_id) 
                VALUES (${nick}, ${stars}, ${description}, ${productId}, ${authorId})
                RETURNING *;
            `);

            const commentMapped = comment.rows.map(this.mapComment);
            res.status(201).json(commentMapped);

        }catch(err){
            console.log(err);
            return res.status(400).send("Niepoprawne dane.");
        }
    }

    updateComment = async (req, res) => {
        try{
            const commentId = parseInt(req.params.id);
            const { nick, stars, description } = req.body;
            
            const response = await pool.query(SQL`
                UPDATE opinia 
                SET nick=${nick}, gwiazdki=${stars} opis=${description}
                WHERE id=${commentId}
                RETURNING id`
            );

            res.status(201).send(`comment with ID: '${response.rows[0].id}' has been modified.`);
        
        }catch(err){
            console.log(err.message);
        }
    } 

    deleteComment = async (req, res) => {
        try{
            const commentId = parseInt(req.params.id);

            const response = await pool.query(SQL`
                DELETE FROM opnia 
                WHERE id=${commentId}
                RETURNING id;
            `);
            
            res.status(200).send('Pomyślnie usunięto.');
        }catch(err){
            console.log(err.message);
        }
    }
}

const commentsController = new CommentsController();
export default commentsController;