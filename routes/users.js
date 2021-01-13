import express from 'express';
import usersController from '../controllers/usersController.js';

const { Router } = express;
const usersRouter = Router();

usersRouter.get('/all', usersController.getAllUsers);
usersRouter.get('/byId/:id', usersController.getUserByID);
usersRouter.post('/create', usersController.createUser);
usersRouter.put('/update/:id', usersController.updateUser);
usersRouter.delete('/delete/:id', usersController.deleteUser);
usersRouter.post('/login', usersController.login);


export default usersRouter;