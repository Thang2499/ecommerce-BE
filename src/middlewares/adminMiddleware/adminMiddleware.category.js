import categoryModel from "../../models/categoryModel.js";
import tokenService from "../../services/jwt.service.js";

const categoryMiddleware = {
    create: async (req, res, next) => {
        try {
            const { name, token } = req.body;

            if (!name) {
                throw Error('Vui long dien day du thong tin');
            }

            const category = await categoryModel.findOne({ name });

            if (category) {
                throw Error('Danh muc da ton tai');
            }
            
            const admin = tokenService.verifyToken(token);
            
            if(admin.role !== 'SUPER_ADMIN' && admin.role !== 'ADMIN') {
                throw Error('Ban khong co quyen');
            }

            next();
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

export default categoryMiddleware;