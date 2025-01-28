import express from 'express';
import systemController from '../../controllers/systemController/systemController.js';
const systemRoute = express.Router();

systemRoute.get('/systemProduct', systemController.getProductsList);
systemRoute.post('/cart', systemController.getCart);
systemRoute.post('/wishList', systemController.getWistList);
systemRoute.post('/addWishList/:id', systemController.addWishList);
systemRoute.post('/deleteWishList', systemController.removeFromWishList);

export default systemRoute;