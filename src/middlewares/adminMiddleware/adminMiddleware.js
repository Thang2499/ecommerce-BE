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

            if (!admin || !admin.isActived) {
                throw Error('Tai khoan khong ton tai');
            }

            if (admin.requesting) {
                throw Error('Tai khoan chua duoc kich hoat');
            }

            const comparePassword = kryptoService.decrypt(password, admin.password);

            if (!comparePassword) {
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

            if (!name || !email || !password || !phone) {
                throw Error('Vui long dien day du thong tin dang ky');
            }

            const admin = await adminModel.findOne({ email });

            if (admin) {
                throw Error('Email da ton tai');
            }

            next();
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    request: async (req, res, next) => {
        try {
            const { token } = req.headers.authorization.split(' ')[1];
            const { id } = req.params;

            const admin = tokenService.verifyToken(token);
            const requester = await adminModel.findOne({ _id: id });

            if (admin.role !== 'SUPER_ADMIN' || !admin.isActived) {
                throw Error('Ban khong co quyen');
            }

            if(!requester || !requester.requesting) {
                throw Error('Tai khoan khong ton tai hoac chua duoc kich hoat');
            }

            next();
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
}
export default adminMiddleware;