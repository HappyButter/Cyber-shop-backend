import express from 'express';
import promosController from '../controllers/promosController.js';

const { Router } = express;
const promosRouter = Router();

promosRouter.get('/', promosController.getAllPromos);
promosRouter.put('/create', promosController.createPromo);
promosRouter.post('/update/:id', promosController.updatePromo);
promosRouter.delete('/delete/:id', promosController.deletePromo);

export default promosRouter;
