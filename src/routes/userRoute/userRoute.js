import express from 'express';
import userController from '../../controllers/userController/userController.js';
import userMiddleware from '../../middlewares/userMiddleware/userMiddleware.js';
import tokenService from '../../services/jwt.service.js';
import { authenticateUser } from '../../middlewares/userMiddleware/jwtMiddleware.js';

const userRoute = express.Router();

// userRoute.get('/user', userMiddleware.checkLogin, userController.login);
userRoute.post('/register',userMiddleware.checkResgister, userController.register)
userRoute.post('/login', userMiddleware.checkLogin, userController.login)
userRoute.post('/refresh-token', tokenService.refreshAccessToken);
userRoute.post('/request-seller', authenticateUser, userController.requestSeller)
export default userRoute;