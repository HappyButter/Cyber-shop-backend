import express from 'express';
import adressesController from '../controllers/addressesController.js';

const { Router } = express;
const adressesRouter = Router();

adressesRouter.get('/user/:id', adressesController.getUserAddresses);
adressesRouter.get('/order/:id', adressesController.getOrderAddress);
adressesRouter.post('/', adressesController.createAddress);
adressesRouter.put('/:id', adressesController.updateAddress);
adressesRouter.delete('/:id', adressesController.deleteAddress);

export default adressesRouter;