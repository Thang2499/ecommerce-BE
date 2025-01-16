import shopModel from "../../models/shopModel.js";
import userModel from "../../models/userModel.js";

const manageShopController = {
    getList: async (req, res) => {
        try {
            const listShop = await shopModel.find({ requesting: true });

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
            const listShop = await shopModel.find({ requesting: false });

            return res.status(200).json({
                message: 'Danh sach',
                listShop: listShop || []
            });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    approve: async (req, res) => {
        const  user  = req.user;
        try {
          await shopModel.findOneAndUpdate({ userId: user._id }, { isActive: true, requesting: false }, { new: true });

            return res.status(200).json({ message: 'Duyet thanh cong' });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    reject: async (req, res) => {
        const { user } = req.user;
        try {
            /* const approvedShop = */await shopModel.findOneAndUpdate({ userId: user._id }, { requesting: false }, { new: true });
            return res.status(200).json({ message: 'Tu choi thanh cong' });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    getListUser: async (req, res) => {
        try {
            const listUser = await userModel.find({ isActived: true });

            return res.status(200).json({
                message: 'Danh sach',
                listUser: listUser || []
            });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
};

export default manageShopController;