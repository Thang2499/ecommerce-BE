import express from 'express';
import userController from '../../controllers/userController/userController.js';
import userMiddleware from '../../middlewares/userMiddleware/userMiddleware.js';
import tokenService from '../../services/jwt.service.js';

const userRoute = express.Router();

userRoute.get('/user', userMiddleware.checkLogin, userController.login);
userRoute.post('/refresh-token', tokenService.refreshAccessToken);

export default userRoute;