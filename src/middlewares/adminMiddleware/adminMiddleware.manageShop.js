import userModel from "../../models/userModel.js";
import shopModel from "../../models/shopModel.js";
import tokenService from "../../services/jwt.service.js";

const manageShopMiddleware = {
    request: async (req, res, next) => {
        try {
            const { id } = req.params;

            const shop = await shopModel.findOne({ _id: id });

            if (!shop) {
                return res.send('User chua tao shop');
            }

            if (!shop.requesting) {
                return res.send('Shop chua request');
            }

            if (shop.isActive) {
                return res.send('User da la shop');
            }

            req.shop = shop;

            next();
        }
        catch (err) {
            return res.send(err.message);
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const shop = await shopModel.findOne({ _id: id });

            if(!shop) {
                return res.send('Shop khong ton tai');
            }

            if(!shop.isActive || shop.requesting) {
                return res.send('Shop khong du dieu kien de xoa');
            }

            req.shop = shop;

            next();

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
    },
};

export default manageShopMiddleware;