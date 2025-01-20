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
adminRoute.post('/signup', imageService.saveSingleImg(), adminMiddleware.register, adminController.register);
adminRoute.post('/getAdminList', adminController.register);
adminRoute.post('/approve/admin', adminMiddleware.request, adminController.approve_ADMIN);
adminRoute.post('/approve/read-only', adminMiddleware.request, adminController.approve_READ_ONLY);

// category
adminRoute.post('/category/create', imageService.saveSingleImg(), categoryMiddleware.create, categoryController.create);
adminRoute.put('/category/update', imageService.saveSingleImg(), categoryMiddleware.update, categoryController.update);
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
