import adminModel from "../../models/adminModel.js";
import tokenService from "../../services/jwt.service.js";
import kryptoService from "../../utils/hashing.js";

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
            return res.status(200).json({
                message: 'Dang nhap thanh cong',
                accessToken,
                admin
                // admin de lam gi vay? lấy thông tin admin để hiển thị thông tin admin đăng nhập,lên FE khỏi phải decode token
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
                phone: phone || '',
                address: address || '',
                gender: gender || ''
            });

            await newAdmin.save();

            return res.status(201).json({ message: 'Request dang ky thanh cong' });
        }
        catch (err) {
            return res.status(400).json({ message: `Unknown bug, ${err.message}` });
        }
    },
    approve_ADMIN: async (req, res) => {
        try {
            const { id } = req.params;
            /* const approveAdmin = */await adminModel.findByIdAndUpdate({ _id: id }, { requesting: false, isActived: true, role: 'ADMIN' }, { new: true });
            return res.status(200).json({ message: 'Approve thanh cong' });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    approve_READ_ONLY: async (req, res) => {
        try {
            const { id } = req.params;
            /* const approveAdmin = */await adminModel.findByIdAndUpdate({ _id: id }, { requesting: false, isActived: true, role: 'READ_ONLY' }, { new: true });
            return res.status(200).json({ message: 'Approve thanh cong' });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    reject: async (req, res) => {
        try {
            const { id } = req.params;
            /* const rejectAdmin = */await adminModel.findByIdAndUpdate({ _id: id }, { requesting: false, isActived: false }, { new: true });
            return res.status(200).json({ message: 'Reject thanh cong' });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
}

export default adminController;