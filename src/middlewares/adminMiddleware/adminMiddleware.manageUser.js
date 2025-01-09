import userModel from "../../models/userModel.js";
import shopModel from "../../models/shopModel.js";
import tokenService from "../../services/jwt.service.js";

const manageUser = {
    approve: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const { id } = req.params;
            const { name, email, phone, address } = req.body;
            
            if(!name, !email, !phone, !description, !address) {
                throw Error('Thieu thong tin');
            }

            const admin = tokenService.verifyToken(token);

            if (admin.role !== 'SUPER_ADMIN' && admin.role !== 'ADMIN' || !admin.isActived) {
                throw Error('Ban khong co quyen');
            }

            
            const user = userModel.findOne({ _id: id });
            
            if (!user || !user.isActived) {
                throw Error('Khong tim thay user');
            }

            const shop = shopModel.findOne({ userId: user });

            if(shop) {
                throw Error('User da la shop');
            }

            req.user = user;
            next();
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
};

export default manageUser;