import express from 'express';
import adminMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.js';
import adminController from '../../controllers/adminController/adminController.js';
import categoryMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.category.js';
import categoryController from '../../controllers/adminController/adminController.category.js';
import manageUserMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.manageUser.js';
import manageUserController from '../../controllers/adminController/adminController.manageUser.js';

const adminRoute = express.Router();
adminRoute.post('/login', adminMiddleware.checkLogin, adminController.login);
adminRoute.post('/signup', adminMiddleware.register, adminController.register);
adminRoute.post('/approve/admin', adminMiddleware.request, adminController.approve_ADMIN);
adminRoute.post('/approve/read-only', adminMiddleware.request, adminController.approve_READ_ONLY);

// category
adminRoute.post('/category/create', categoryMiddleware.create, categoryController.create);

// manage user
adminRoute.get('/user/list', manageUserController.getList);
adminRoute.post('/user/approve', manageUserMiddleware.request, manageUserController.approve);
adminRoute.post('/user/reject', manageUserMiddleware.request, manageUserController.reject);

export default adminRoute;
