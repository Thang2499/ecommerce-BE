import express from 'express';
import adminMiddleware from '../../middlewares/adminMiddleware/adminMiddleware.js';
import adminController from '../../controllers/adminController/adminController.js';

const adminRoute = express.Router();
adminRoute.post('/login', adminMiddleware.checkLogin, adminController.login);

export default adminRoute;