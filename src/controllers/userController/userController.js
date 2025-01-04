import userModel from "../../models/userModel.js";
import jwt from 'jsonwebtoken'
import tokenService from "../../services/jwt.service.js";
import kryptoService from "../../utils/hashing.js";


const userController = {
    login: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await userModel.findOne({ email });
            const accessToken = tokenService.signAccessToken({ user });
            const refreshToken = tokenService.signRefreshToken({ user });
            return res.status(200).json({
                message: 'Dang nhap thanh cong',
                accessToken,
                refreshToken,
            });
        } catch (err) {
            return res.status(400).json({ message: `Unknown bug, ${err.message}` });
        }
    },

    register: async (res, req) => {
        try {
            const { name, password, email } = req.body;
            const hashPassword = kryptoService.encrypt(password);
            const newUser = new userModel({
                name,
                email,
                password: hashPassword,
            });

            await newUser.save();

            const accessToken = tokenService.signAccessToken({ user: newUser });
            const refreshToken = tokenService.signRefreshToken({ user: newUser });

            return res.status(201).json({
                message: 'Dang ky thanh cong',
                accessToken,
                refreshToken,
            });
        } catch (err) {
            return res.status(400).json({ message: `Unknown bug, ${err.message}` });
        }
    },

    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body

            if (!refreshToken) {
                return res.status(401).json({ message: 'Token is required' });
            }
            jwt.verify(refreshToken, process.env.SECREY_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Token khong hop le' });
                }
                const userId = decoded.user._id;
                const user = await userModel.findById(userId).populate({
                    path: 'shopId',
                    model: 'shops',
                });
                if (!user) {
                    return res.status(401).json({ message: 'User khong hop le' })
                }
                const newAccessToken = tokenService.signAccessToken({ user });
                res.status(200).json({ accessToken: newAccessToken });
            });
        } catch (err) {
            return err.error;
        }
    }
}
export default userController;