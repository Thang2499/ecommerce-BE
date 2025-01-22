import express from 'express';
import { imageService } from '../../services/multer.service.js';
import adminToken from './adminToken.js';
// admin
import adminMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.js';
import adminController from '../../controllers/adminController/adminController.js';
// category
import categoryMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.category.js';
import categoryController from '../../controllers/adminController/adminController.category.js';
// shop
import manageShopMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.manageShop.js';
import manageShopController from '../../controllers/adminController/adminController.manageShop.js';
// user
import manageUserMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.user.js';
import manageUserController from '../../controllers/adminController/adminController.user.js';

const adminRoute = express.Router();
adminRoute.post('/login', adminMiddleware.checkLogin, adminController.login);
adminRoute.post('/create/admin', adminToken, adminMiddleware.create, adminController.create_ADMIN);
adminRoute.post('/create/read-only', adminToken, adminMiddleware.create, adminController.create_READ_ONLY);
adminRoute.put('/update', adminToken, imageService.saveSingleImg(), adminController.update);

// category
adminRoute.post('/category/create', adminToken, imageService.saveSingleImg(), categoryMiddleware.create, categoryController.create);
adminRoute.put('/category/update', adminToken, imageService.saveSingleImg(), categoryMiddleware.update, categoryController.update);
adminRoute.delete('/category/delete', adminToken, categoryMiddleware.delete, categoryController.delete);

// manage shop
adminRoute.get('/shop/list/active', adminToken, manageShopController.getListActiveShop);
adminRoute.get('/shop/list/requesting', adminToken, manageShopController.getListRequestingShop);
adminRoute.post('/shop/approve/:id', adminToken, manageShopMiddleware.request, manageShopController.approve);
adminRoute.post('/shop/reject/:id', adminToken, manageShopMiddleware.request, manageShopController.reject);
adminRoute.post('/shop/delete/:id', adminToken, manageShopMiddleware.delete, manageShopController.delete);

// manage user
adminRoute.get('/user/list', adminToken, manageUserController.getListUser);


export default adminRoute;
