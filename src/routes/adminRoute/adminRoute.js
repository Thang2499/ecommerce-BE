import express from 'express';
import { imageService } from '../../services/multer.service.js';
import adminMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.js';
import adminController from '../../controllers/adminController/adminController.js';
import categoryMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.category.js';
import categoryController from '../../controllers/adminController/adminController.category.js';
import manageUserMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.manageUser.js';
import manageUserController from '../../controllers/adminController/adminController.manageUser.js';

const adminRoute = express.Router();
adminRoute.post('/login', adminMiddleware.checkLogin, adminController.login);
adminRoute.post('/signup', imageService.saveSingleImg('avatar'), adminMiddleware.register, adminController.register);
adminRoute.post('/approve/admin', adminMiddleware.request, adminController.approve_ADMIN);
adminRoute.post('/approve/read-only', adminMiddleware.request, adminController.approve_READ_ONLY);

// category
adminRoute.post('/category/create', imageService.saveSingleImg('category'), categoryMiddleware.create, categoryController.create);
adminRoute.put('/category/update', imageService.saveSingleImg('category'), categoryMiddleware.update, categoryController.update);
adminRoute.delete('/category/delete', categoryMiddleware.delete, categoryController.delete);

// manage shop
adminRoute.get('/shop/listReq', manageUserController.getListReqShop);
adminRoute.get('/shop/listActive', manageUserController.getListActiveShop);
adminRoute.post('/shop/approve/:id', manageUserMiddleware.request, manageUserController.approve);
adminRoute.post('/shop/reject/:id', manageUserMiddleware.request, manageUserController.reject);
adminRoute.get('/user/list', manageUserController.getListUser);

//manage admin


export default adminRoute;
