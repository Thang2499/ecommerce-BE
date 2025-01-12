import express from 'express';
import categoryMiddleware from '../../middlewares/category/categoryMiddleware.js';
import categoryController from '../../controllers/category/categoryController.js';

const categoryRoute = express.Router();

categoryRoute.get('/list', categoryController.getList);
categoryRoute.get('/listChild/:id', categoryController.getListChildcategory);

export default categoryRoute;