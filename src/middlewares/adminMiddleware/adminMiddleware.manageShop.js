import shopModel from "../../models/shopModel.js";

const manageShopMiddleware = {
    request: async (req, res, next) => {
        const { id } = req.params;
        try {
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
        const { id } = req.params;
        try {
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
            return res.send(err.message);
        }
    },
};

export default manageShopMiddleware;