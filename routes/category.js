import express from 'express';
import categoryController from '../controllers/categoryController.js';

const { Router } = express;
const categoryRouter = Router();

categoryRouter.put('/create', categoryController.addCategoryType);
categoryRouter.get('/', categoryController.getAllCategories);

export default categoryRouter;