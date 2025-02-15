import productModel from "../../models/productModel.js";
import userModel from "../../models/userModel.js";
import tokenService from "../../services/jwt.service.js";

const systemMiddleware = {
    userToken: async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];

            if (!token) {
                return res.status(401).send("Unauthenticated")
            }
            const decodedToken = tokenService.verifyToken(token);
            if (decodedToken.status === 401) {
                return res.status(401).send(decodedToken.message);
            }
            const user = await userModel.findById(decodedToken.user._id);

            if (!user) {
                return res.send('Tai khoan khong ton tai');
            }

            req.user = user;

            next();
        }
        catch (err) {
            return res.send(err.message);
        }
    },
    postComment: async (req, res, next) => {
        const { id } = req.params;
        const { userId, text } = req.body;
        try {
            const product = await productModel.findById(id);
            const user = await userModel.findById(userId);

            if (!product) {
                return res.send('Product khong ton tai');
            }
            if(!user) {
                return res.send('User khong ton tai');
            }
            if(!text || text.length < 1) {
                return res.send('Comment khong duoc de trong');
            }

            next();
        }
        catch (err) {
            return res.send(err.message);
        }
    }
}
export default systemMiddleware;