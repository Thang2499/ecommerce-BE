import categoryModel from "../../models/categoryModel.js";

const categoryController = {
    getList: async (req, res) => {
        try {
            const listCategory = await categoryModel.find();
            return res.status(200).json({
                message: 'Danh sach',
                listCategory: listCategory || []
            });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
};

export default categoryController;