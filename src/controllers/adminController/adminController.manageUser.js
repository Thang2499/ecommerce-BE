import shopModel from "../../models/shopModel.js";
import shopModel from "../../models/shopModel.js";

const manageUserController = {
    approve: async (req, res) => {
        try {
            /* const approvedShop = */await shopModel.findOneAndUpdate({ userId: user }, { isActive: true }, { new: true });

            return res.status(200).json({ message: 'Duyet thanh cong' });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
};

export default manageUserController;