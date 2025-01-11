import shopModel from "../../models/shopModel.js";

const manageUserController = {
    approve: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, phone, description, address } = req.body;
            const shop = new shopModel({
                userId: id,
                name,
                email,
                phone,
                description: description || '',
                address,
            });
            await shop.save();

            return res.status(200).json({ message: 'Duyet thanh cong' });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
};

export default manageUserController;