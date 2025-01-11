import express from 'express';
import userController from '../../controllers/userController/userController.js';
import userMiddleware from '../../middlewares/userMiddleware/userMiddleware.js';
import tokenService from '../../services/jwt.service.js';
import { authenticateUser } from '../../middlewares/userMiddleware/jwtMiddleware.js';

const userRoute = express.Router();

userRoute.get('/user', userMiddleware.checkLogin, userController.login);
userRoute.post('/register', userController.register)
userRoute.post('/login',userController.login)
userRoute.post('/refresh-token', tokenService.refreshAccessToken);
userRoute.post('/request-seller/:userId', authenticateUser, userController.requestSeller)
export default userRoute;