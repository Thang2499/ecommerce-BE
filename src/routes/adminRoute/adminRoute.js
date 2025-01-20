import express from 'express';
import { imageService } from '../../services/multer.service.js';
import adminMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.js';
import adminController from '../../controllers/adminController/adminController.js';
import categoryMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.category.js';
import categoryController from '../../controllers/adminController/adminController.category.js';
import manageShopMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.manageShop.js';
import manageShopController from '../../controllers/adminController/adminController.manageShop.js';

const adminRoute = express.Router();
adminRoute.post('/login', adminMiddleware.checkLogin, adminController.login);
adminRoute.post('/create/admin', adminMiddleware.create, adminController.create_ADMIN);
adminRoute.post('/create/read-only', adminMiddleware.create, adminController.create_READ_ONLY);

// category
adminRoute.post('/category/create', imageService.saveSingleImg('category'), categoryMiddleware.create, categoryController.create);
adminRoute.put('/category/update', imageService.saveSingleImg('category'), categoryMiddleware.update, categoryController.update);
adminRoute.delete('/category/delete', categoryMiddleware.delete, categoryController.delete);

// manage shop
adminRoute.get('/shop/list', manageShopController.getList);
adminRoute.post('/shop/approve/:id', manageShopMiddleware.request, manageShopController.approve);
adminRoute.post('/shop/reject/:id', manageShopMiddleware.request, manageShopController.reject);
// adminRoute.post('/shop/disable/:id', manageShopMiddleware.disable, manageShopController.disable);
adminRoute.get('/shop/listActive', manageShopController.getListActiveShop);

// manage user
adminRoute.get('/user/list', manageShopController.getListUser);

//manage admin

export default adminRoute;
