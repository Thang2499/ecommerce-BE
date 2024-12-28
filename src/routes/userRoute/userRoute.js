import express from 'express';
import userController from '../../controllers/userController/userController.js';
import userMiddleware from '../../middlewares/userMiddleware/userMiddleware.js';

const userRoute = express.Router();

userRoute.get('/user', userMiddleware.checkLogin, userController.login);

export default userRoute;