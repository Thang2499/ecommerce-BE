import express from 'express';
import systemController from '../../controllers/systemController/systemController.js';
import systemMiddleware from '../../middlewares/systemMiddleware/systemMiddleware.js';
import { authenticateUser } from '../../middlewares/userMiddleware/jwtMiddleware.js';

const systemRoute = express.Router();

systemRoute.get('/systemProduct', systemController.getProductsList);
systemRoute.post('/cart', systemController.getCart);
systemRoute.post('/wishList', systemController.getWistList);
systemRoute.post('/addWishList/:id', systemController.addWishList);
systemRoute.post('/deleteWishList', systemController.removeFromWishList);
systemRoute.post('/addToCart', systemController.addToCart);
systemRoute.post('/removeFromCart', systemController.removeFromCart);
systemRoute.get('/viewCart', systemMiddleware.userToken, systemController.viewCart);
systemRoute.post('/createOrder', authenticateUser, systemController.createOrder);
systemRoute.post('/productDetail', systemController.productDetail);

// commenting
systemRoute.get('/comments', systemController)

export default systemRoute;