import express from 'express';
import usersController from '../controllers/usersController.js';

const { Router } = express;
const usersRouter = Router();

usersRouter.get('/', usersController.getAllUsers);
usersRouter.get('/:id', usersController.getUserByID);
usersRouter.post('/update/:id', usersController.updateUser);
usersRouter.delete('/delete/:id', usersController.deleteUser);


export default usersRouter;