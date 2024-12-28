import express from 'express';
import userRoute from './userRoute/userRoute.js';
import adminRoute from './adminRoute/adminRoute.js';
import shopRoute from './shopRoute/shopRoute.js';
const indexRoute = express.Router();

indexRoute.use('/user', userRoute);
indexRoute.use('/admin', adminRoute);
indexRoute.use('/shop', shopRoute);
export default indexRoute;