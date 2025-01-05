import userModel from "../../models/userModel.js";
import tokenService from "../../services/jwt.service.js";
import kryptoService from "../../utils/hashing.js";

const userController = {
    login: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await userModel.findOne({ email });
            const accessToken = tokenService.signAccessToken({ user });
            const refreshToken = tokenService.signRefreshToken({ user });
            res.cookie('refresh-Token',refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 24 * 60 * 60 * 1000
            })
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
}
export default userController;