import categoryModel from "../../models/categoryModel.js";
import tokenService from "../../services/jwt.service.js";

const categoryMiddleware = {
    create: async (req, res, next) => {
        try {
            const { name } = req.body;
            const token = req.headers.authorization.split(' ')[1];

            const admin = tokenService.verifyToken(token);
            if (admin.admin.isActived === false || admin.admin.role !== 'ADMIN') {
                throw Error('Ban khong co quyen');
            }

            if (!name) {
                return res.send('Vui long dien day du thong tin');
            }

            const category = await categoryModel.findOne({ name });

            if (category) {
                return res.send('Danh muc da ton tai');
            }

            req.admin = admin;

            next();
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            const token = req.headers.authorization.split(' ')[1];

            const admin = tokenService.verifyToken(token);

            if (admin.admin.role !== 'SUPER_ADMIN' || !admin.admin.isActived) {
                return res.send('Ban khong co quyen');
            }

            const category = await categoryModel.findOne({ _id: id });

            if (!category) {
                return res.send('Danh muc khong ton tai');
            }

            next();
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    delete: async (req, res, next) => {
        try {
            const { id } = req.params;
            const token = req.headers.authorization.split(' ')[1];

            const admin = tokenService.verifyToken(token);

            if (admin.admin.role !== 'SUPER_ADMIN' || !admin.admin.isActived) {
                throw Error('Ban khong co quyen');
            }

            const category = await categoryModel.findOne({ _id: id });

            if (!category) {
                throw Error('Danh muc khong ton tai');
            }

            next();
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
}

export default categoryMiddleware;