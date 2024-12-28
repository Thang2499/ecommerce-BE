import express from 'express';
import shopMiddleware from '../../middlewares/shopMiddleware/shopMiddleware.js';
import shopController from '../../controllers/shopController/shopController.js';

const shopRoute = express.Router();
shopRoute.get('/shopPage', shopMiddleware.checkShop, shopController.getShop);

export default shopRoute;