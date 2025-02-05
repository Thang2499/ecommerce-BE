import express from 'express';
import userRoute from './userRoute/userRoute.js';
import adminRoute from './adminRoute/adminRoute.js';
import shopRoute from './shopRoute/shopRoute.js';
import categoryRoute from './category/categoryRoute.js';
import systemRoute from './systemRoute/systemRoute.js';
import manageGHN from './systemRoute/systemRoute.GHN.js';
import tokenService from '../services/jwt.service.js';
const indexRoute = express.Router();

indexRoute.use('/user', userRoute);
indexRoute.use('/admin', adminRoute);
indexRoute.use('/shop', shopRoute);
indexRoute.use('/category', categoryRoute);
indexRoute.use('/system', systemRoute);
indexRoute.use('/API', manageGHN);
indexRoute.post('/refresh-token', tokenService.refreshAccessToken);
export default indexRoute;