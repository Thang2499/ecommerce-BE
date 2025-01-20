import fs from 'fs';
import adminModel from "../../models/adminModel.js";
import tokenService from "../../services/jwt.service.js";
import kryptoService from "../../utils/hashing.js";
import cloudinaryService from '../../services/cloudinary.service.js';

const filePath = fs.realpathSync('./');

const adminController = {
    login: async (req, res) => {
        try {
            const { email } = req.body;
            const admin = await adminModel.findOne({ email, isActived: true, requesting: false });
            const accessToken = tokenService.signAccessToken({ admin });
            const refreshToken = tokenService.signRefreshToken({ admin });
            res.cookie('refresh-Token', refreshToken, {
                signed: true,
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 24 * 60 * 60 * 1000
            })
            return res.json({
                message: 'Dang nhap thanh cong',
                accessToken,
                admin
                // admin de lam gi vay? lấy thông tin admin để hiển thị thông tin admin đăng nhập,lên FE khỏi phải decode token
            });
        }
        catch (err) {
            return res.status(400).send(err.message);
        }
    },
    create_ADMIN: async (req, res) => {
        try {
            const { email, password, name, phone, address, gender } = req.body;

            const hashPassword = kryptoService.encrypt(password);

            const approvedAdmin = new adminModel({
                email,
                password: hashPassword,
                name,
                phone,
                address,
                gender: gender || '',
                role: 'ADMIN',
                isActived: true
            });

            await approvedAdmin.save();

            return res.send('tao ADMIN thanh cong');
        }
        catch (err) {
            return res.status(400).send(err.message);
        }
    },
    create_READ_ONLY: async (req, res) => {
        try {
            const { email, password, name, phone, address, gender } = req.body;

            const hashPassword = kryptoService.encrypt(password);

            const approveReadOnly = new adminModel({
                email,
                password: hashPassword,
                name,
                phone,
                address,
                gender: gender || '',
                isActived: true
            });

            await approveReadOnly.save();

            return res.send('tao READ_ONLY thanh cong');
        }
        catch (err) {
            return res.status(400).send(err.message);
        }
    },
}

export default adminController;