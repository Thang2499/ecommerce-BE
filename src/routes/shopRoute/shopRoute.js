import express from 'express';
import shopMiddleware from '../../middlewares/shopMiddleware/shopMiddleware.js';
import shopController from '../../controllers/shopController/shopController.js';
import {imageService}   from '../../services/multer.service.js';

const shopRoute = express.Router();

shopRoute.post('/shopProfile', shopMiddleware.shopToken, shopController.getShopProfile);
shopRoute.post('/productList', shopMiddleware.shopToken, shopController.getProductList);
shopRoute.post('/addProduct', imageService.saveSingleImg(), shopController.createProduct);
shopRoute.put('/updateProduct/:id', imageService.saveSingleImg(), shopController.updateProduct);
shopRoute.delete('/deleteProduct/:id', imageService.saveSingleImg(), shopController.deleteProduct);
shopRoute.put('/approveOrder/:orderId', shopMiddleware.shopToken, shopController.approveOrder);
shopRoute.get('/manageOrder',shopMiddleware.shopToken, shopController.manageOrder);

export default shopRoute;