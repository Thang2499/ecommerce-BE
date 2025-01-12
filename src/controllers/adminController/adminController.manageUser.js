import shopModel from "../../models/shopModel.js";

const manageUserController = {
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
    approve: async (req, res) => {
        try {
            /* const approvedShop = */await shopModel.findOneAndUpdate({ userId: user }, { isActive: true, requesting: false }, { new: true });

            return res.status(200).json({ message: 'Duyet thanh cong' });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    reject: async (req, res) => {
        try {
            /* const approvedShop = */await shopModel.findOneAndUpdate({ userId: user }, { requesting: false }, { new: true });
            return res.status(200).json({ message: 'Tu choi thanh cong' });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
};

export default manageUserController;