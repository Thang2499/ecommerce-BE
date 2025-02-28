import express from 'express';
import systemController from '../../controllers/systemController/systemController.js';
import systemMiddleware from '../../middlewares/systemMiddleware/systemMiddleware.js';
const systemRoute = express.Router();

systemRoute.get('/systemProduct', systemController.getProductsList);
systemRoute.get('/productByCategory/:CategoryId', systemController.getProductByCategory);
systemRoute.post('/cart', systemController.getCart);
systemRoute.post('/wishList',systemMiddleware.userToken, systemController.getWistList);
systemRoute.post('/addWishList/:id',systemMiddleware.userToken, systemController.addWishList);
systemRoute.post('/deleteWishList',systemMiddleware.userToken, systemController.removeFromWishList);
systemRoute.post('/addToCart',systemMiddleware.userToken, systemController.addToCart);
systemRoute.post('/removeFromCart',systemMiddleware.userToken, systemController.removeFromCart);
systemRoute.get('/viewCart',systemMiddleware.userToken, systemController.viewCart);
systemRoute.post('/createOrder',systemMiddleware.userToken, systemController.createOrder);
systemRoute.post('/productDetail',systemController.productDetail);
systemRoute.post('/productSearch/:name',systemController.searchProduct);
export default systemRoute;