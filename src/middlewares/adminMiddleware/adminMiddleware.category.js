import categoryModel from "../../models/categoryModel.js";
import tokenService from "../../services/jwt.service.js";

const categoryMiddleware = {
    create: async (req, res, next) => {
        try {
            const { name } = req.body;
            const token = req.headers.authorization.split(' ')[1];

            const admin = tokenService.verifyToken(token);

            if (admin.role !== 'SUPER_ADMIN' || !admin.isActived) {
                throw Error('Ban khong co quyen');
            }

            if (!name) {
                throw Error('Vui long dien day du thong tin');
            }

            const category = await categoryModel.findOne({ name });

            if (category) {
                throw Error('Danh muc da ton tai');
            }

            req.admin = admin;

            next();
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
}

export default categoryMiddleware;