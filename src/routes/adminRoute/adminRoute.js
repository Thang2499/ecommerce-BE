import express from 'express';
import adminMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.js';
import adminController from '../../controllers/adminController/adminController.js';
import categoryMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.category.js';
import categoryController from '../../controllers/adminController/adminController.category.js';


const adminRoute = express.Router();
adminRoute.post('/login', adminMiddleware.checkLogin, adminController.login);
adminRoute.post('/signup', adminMiddleware.register, adminController.register);

// category


export default adminRoute;