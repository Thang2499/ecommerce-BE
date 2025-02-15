import adminModel from "../../models/adminModel.js";
import kryptoService from "../../utils/hashing.js";
import tokenService from "../../services/jwt.service.js";


const adminMiddleware = {
    checkLogin: async (req, res, next) => {
        const { email, password } = req.body;
        try {

            if (!email || !password) {
                return res.send('Vui long dien day du thong tin dang nhap');
            }

            const admin = await adminModel.findOne({ email });
            if (!admin ) {
                return res.send('Tai khoan khong ton tai');
            }

            const comparePassword = kryptoService.decrypt(password, admin.password);

            if (!comparePassword) {
                return res.send('Sai mat khau');
            };

            next();

        } catch (err) {
            return res.send(err.message);
        }
    },
    create: async (req, res, next) => {
        const { email, password, name, phone, address } = req.body;
        const admin = req.admin;
        try {

            if (admin.role !== 'SUPER_ADMIN' && !admin.isActive) {
                return res.send('Ban khong co quyen');
            }

            // các trường required
            if (!email || !password || !name || !phone || !address) {
                return res.send('Vui long dien day du thong tin');
            }


            // self explanatory
            const duplicate = await adminModel.findOne({
                $or: [
                    { email },
                    { name }
                ]
            });
            if (duplicate) {
                return res.send('Tai khoan da ton tai');
            }

            next();
        }
        catch (err) {
            return res.send(err.message);
        }
    },
    // update: async (req, res, next) => {
    //     try {
    //         const admin = req.admin;

    //         next();
    //     }
    //     catch (err) {
    //         return res.send(err.message);
    //     }
    // }
}
export default adminMiddleware;