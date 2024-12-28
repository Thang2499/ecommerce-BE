import dotenv from 'dotenv';
import userModel from '../models/userModel.js';
import tokenService from '../services/jwt.service.js';
dotenv.config();

//Hàm lấy lại accessToken khi hết hạn
const authenticateToken = async (req, res, next) => {
    try {
        const authorizationData = req.headers['authorization']
        // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZjE2ZTk0NDQyYmVkYTZjZGU5MzIiLCJpYXQiOjE3MzA1NTY2OTMsImV4cCI6MTczMDU2MDI5M30.kjjgI3qomhvDimlBVN8LdUDDyFIjkmI59pS1EP_Iu0k
        if (!authorizationData) {
           return res.status(401).send("Unauthenticated")
        }
        const accessToken = authorizationData.split(' ')[1]
        if (!accessToken) {
            return res.status(401).send("Unauthenticated")
         }
        const userData = tokenService.verifyToken(accessToken)
        if(userData.status === 401){
            return res.status(401).send('Unauthenticated')
        }
        const user = await userModel.findById(userData.user._id).populate({
            path: 'shopId',
            model: 'shops'
        });
        if (!user){
            return res.status(404).send("User not found")
         }
        req.user = user
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default authenticateToken;
