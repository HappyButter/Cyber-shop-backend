import express from 'express';
import authController from '../controllers/authController.js';

const { Router } = express;
const authRouter = Router();

authRouter.put('/login', authController.login);
authRouter.post('/register', authController.register);


export default authRouter;