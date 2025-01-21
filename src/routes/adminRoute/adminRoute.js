import express from 'express';
import { imageService } from '../../services/multer.service.js';
import adminMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.js';
import adminController from '../../controllers/adminController/adminController.js';
import categoryMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.category.js';
import categoryController from '../../controllers/adminController/adminController.category.js';
import manageShopMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.manageShop.js';
import manageShopController from '../../controllers/adminController/adminController.manageShop.js';
import adminToken from './adminToken.js';

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
adminRoute.get('/shop/list', manageShopController.getList);
adminRoute.post('/shop/approve/:id', manageShopMiddleware.request, manageShopController.approve);
adminRoute.post('/shop/reject/:id', manageShopMiddleware.request, manageShopController.reject);
// adminRoute.post('/shop/disable/:id', manageShopMiddleware.disable, manageShopController.disable);
adminRoute.get('/shop/listActive', manageShopController.getListActiveShop);

// manage user
adminRoute.get('/user/list', manageShopMiddleware.getListUser, manageShopController.getListUser);

//manage admin

export default adminRoute;
