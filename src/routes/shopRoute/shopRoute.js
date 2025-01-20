import express from 'express';
import shopMiddleware from '../../middlewares/shopMiddleware/shopMiddleware.js';
import shopController from '../../controllers/shopController/shopController.js';
import {imageService}   from '../../services/multer.service.js';
const shopRoute = express.Router();
shopRoute.post('/shopProfile', shopController.getShopProfile);
shopRoute.post('/productList', shopController.getProductList);
shopRoute.post('/addProduct', imageService.saveSingleImg(), shopController.createProduct);
export default shopRoute;