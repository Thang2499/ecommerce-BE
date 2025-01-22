import userModel from "../../models/userModel.js";
import shopModel from "../../models/shopModel.js";
import tokenService from "../../services/jwt.service.js";

const manageShopMiddleware = {
    request: async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const { id } = req.params;
            const admin = tokenService.verifyToken(token);

            if (admin.admin.role !== 'SUPER_ADMIN' && admin.admin.role !== 'ADMIN' || !admin.admin.isActived) {
                throw Error('Ban khong co quyen');
            }

            const user = await userModel.findOne({ _id: id });
            if (!user || !user.isActived) {
                throw Error('Khong tim thay user');
            }

            const shop = await shopModel.findOne({ userId: user._id });

            if (!shop) {
                throw Error('User chua tao shop');
            }

            if (!shop.requesting) {
                throw Error('Shop chua request');
            }

            if (shop.isActive) {
                throw Error('User da la shop');
            }
            req.user = user;
            next();
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    disable: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const { id } = req.params;

            const admin = tokenService.verifyToken(token);

            if (admin.role !== 'SUPER_ADMIN' && admin.role !== 'ADMIN' || !admin.isActived) {
                throw Error('Ban khong co quyen');
            }
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    getListUser: async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = tokenService.verifyToken(null);
            const admin = await userModel.findOne({ email: decodedToken.admin.email });
          
        }
        catch (err) {
            return res.send(err.message);
        }
    }
};

export default manageShopMiddleware;