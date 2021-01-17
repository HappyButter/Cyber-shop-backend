import express from 'express';
import commentsController from '../controllers/commentsController.js';

const { Router } = express;
const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.getCommentsByProductId);
commentsRouter.put('/create', commentsController.createComment);
commentsRouter.post('/update/:id', commentsController.updateComment);
commentsRouter.delete('/:id', commentsController.deleteComment);


export default commentsRouter;