import adminModel from "../../models/adminModel.js";
import kryptoService from "../../utils/hashing.js";

const adminMiddleware = {
    checkLogin: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw Error('Vui long dien day du thong tin dang nhap');
            }

            const admin = await adminModel.findOne({ email });

            if (!admin) {
                throw Error('Email khong ton tai');
            }

            const comparepassword = kryptoService.decrypt(password, admin.password);

            if (!comparepassword) {
                throw Error('Sai mat khau');
            };

            next();

        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    register: async (req, res, next) => {
        try {
            const { name, email, password, phone } = req.body;

            if(!name || !email || !password || !phone) {
                throw Error('Vui long dien day du thong tin dang ky');
            }

            const admin = await adminModel.findOne({ email });

            if(admin) {
                throw Error('Email da ton tai');
            }

            next();
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
}
export default adminMiddleware;