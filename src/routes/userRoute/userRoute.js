import express from 'express';
import userController from '../../controllers/userController/userController.js';
import userMiddleware from '../../middlewares/userMiddleware/userMiddleware.js';
import { authenticateUser } from '../../middlewares/userMiddleware/jwtMiddleware.js';

const userRoute = express.Router();

userRoute.post('/register',userMiddleware.checkResgister, userController.register);
userRoute.post('/login', userMiddleware.checkLogin, userController.login);
userRoute.post('/request-seller', authenticateUser, userController.requestSeller);
userRoute.get('/viewOrder', authenticateUser, userController.viewOrder);
userRoute.post('/editProfile', authenticateUser, userController.editProfile);
userRoute.post('/fetchUserInfo', authenticateUser, userController.fetchUserInfo);
export default userRoute;