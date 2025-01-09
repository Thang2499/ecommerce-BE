import express from 'express';
import adminMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.js';
import adminController from '../../controllers/adminController/adminController.js';

const adminRoute = express.Router();
adminRoute.post('/login', adminMiddleware.checkLogin, adminController.login);
adminRoute.post('/signup', adminMiddleware.register, adminController.register);

// category
adminRoute.post('/category/create', adminMiddleware.category.create, adminController.category.create);

export default adminRoute;