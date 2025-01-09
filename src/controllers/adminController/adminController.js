import adminModel from "../../models/adminModel.js";
import tokenService from "../../services/jwt.service.js";
import kryptoService from "../../utils/hashing.js";

const adminController = {
    login: async (req, res) => {
        try {
            const { email } = req.body;
            const admin = await adminModel.findOne({ email });
            const accessToken = tokenService.signAccessToken({ admin });
            const refreshToken = tokenService.signRefreshToken({ admin });
            res.cookie('refresh-Token',refreshToken, {
                signed: true,
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 24 * 60 * 60 * 1000
            })
            return res.status(200).json({
                message: 'Dang nhap thanh cong',
                accessToken,
                admin
            });
        }
        catch (err) {
            return res.status(400).json({ message: `Unknown bug, ${err.message}` });
        }
    },
    register: async (req, res) => {
        try {
            const { name, email, password, phone, address, gender } = req.body;

            console.log(name, email, password)

            const hashPassword = await kryptoService.encrypt(password);

            const newAdmin = new adminModel({
                name,
                email,
                password: hashPassword,
                phone,
                address: address || "",
                gender: gender || ""
            });

            await newAdmin.save();

            const accessToken = tokenService.signAccessToken({ user: newAdmin });
            const refreshToken = tokenService.signRefreshToken({ user: newAdmin });

            return res.status(201).json({
                message: 'Dang ky thanh cong',
                accessToken,
                refreshToken
            });
        }
        catch (err) {
            return res.status(400).json({ message: `Unknown bug, ${err.message}` });
        }
    }
}

export default adminController;