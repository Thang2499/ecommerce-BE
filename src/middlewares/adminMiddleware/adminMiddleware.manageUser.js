import userModel from "../../models/userModel.js";
import shopModel from "../../models/shopModel.js";
import tokenService from "../../services/jwt.service.js";

const manageUser = {
    approve: async (req, res) => {
        try {
            const { id } = req.params;
            const { token } = req.body;

            const admin = tokenService.verifyToken(token);

            if (admin.role !== 'SUPER_ADMIN' && admin.role !== 'ADMIN') {
                throw Error('Ban khong co quyen');
            }

            
            const user = userModel.findOne({ _id: id });
            
            if (!user) {
                throw Error('Khong tim thay user');
            }

            const shop = shopModel.findOne({ userId: user });

            if(shop) {
                throw Error('User da la shop');
            }

            next();
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
};

export default manageUser;