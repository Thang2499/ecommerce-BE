import shopModel from "../../models/shopModel.js";

const manageShopController = {
    getListRequestingShop: async (req, res) => {
        try {
            const listShop = await shopModel.find({ requesting: true, isActive: false });

            return res.status(200).json({
                message: 'Danh sach',
                listShop: listShop || []
            });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    getListActiveShop: async (req, res) => {
        try {
            const listShop = await shopModel.find({ requesting: false, isActive: true });

            return res.status(200).json({
                message: 'Danh sach',
                listShop: listShop || []
            });
        }
        catch (err) {
            return res.send(err.message);
        }
    },
    approve: async (req, res) => {
        const shop = req.shop;
        try {
          /* const approvedShop = */await shopModel.findOneAndUpdate({ _id: shop._id }, { isActive: true, requesting: false }, { new: true });

            return res.send('Duyet thanh cong');
        }
        catch (err) {
            return res.send(err.message)
        }
    },
    reject: async (req, res) => {
        const shop = req.shop;
        try {
            /* const approvedShop = */await shopModel.findOneAndUpdate({ _id: shop._id }, { requesting: false }, { new: true });
            return res.send('Tu choi thanh cong');
        }
        catch (err) {
            return res.send(err.message);
        }
    },
    delete: async (req, res) => {
        const shop = req.shop;
        try {
            await shopModel.findOneAndDelete({ _id: shop._id });
            return res.send('Xoa thanh cong');
        }
        catch (err) {
            return res.send(err.message);
        }
    }
};

export default manageShopController;