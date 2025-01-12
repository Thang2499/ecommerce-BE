import express from 'express';
import userRoute from './userRoute/userRoute.js';
import adminRoute from './adminRoute/adminRoute.js';
import shopRoute from './shopRoute/shopRoute.js';
import categoryRoute from './category/categoryRoute.js';
const indexRoute = express.Router();

indexRoute.use('/user', userRoute);
indexRoute.use('/admin', adminRoute);
indexRoute.use('/shop', shopRoute);
indexRoute.use('/category', categoryRoute);
export default indexRoute;