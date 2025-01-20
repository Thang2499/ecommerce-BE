import fs from "fs";
import adminModel from "../../models/adminModel.js";
import kryptoService from "../../utils/hashing.js";
import tokenService from "../../services/jwt.service.js";

const filePath = fs.realpathSync('./');

const adminMiddleware = {
    checkLogin: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.send('Vui long dien day du thong tin dang nhap');
            }

            const admin = await adminModel.findOne({ email });

            if (!admin || !admin.isActived) {
                return res.send('Tai khoan khong ton tai');
            }

            const comparePassword = kryptoService.decrypt(password, admin.password);

            if (!comparePassword) {
                return res.send('Sai mat khau');
            };

            next();

        } catch (err) {
            return res.status(400).send(err.message);
        }
    },
    create: async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const { email, password, name, phone, address } = req.body;

            // check token có valid hay không; valid thì check real time role có phải là SUPER_ADMIN hay không
            const decodedToken = tokenService.verifyToken(token);
            const admin = await adminModel.findOne({ email: decodedToken.admin.email });

            if (admin.role !== 'SUPER_ADMIN' || !admin.isActived) {
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
            return res.status(400).send(err.message);
        }
    }
}
export default adminMiddleware;