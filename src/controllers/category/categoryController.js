import categoryModel from "../../models/categoryModel.js";

const categoryController = {
    getList: async (req, res) => {
        try {
            const listCategory = await categoryModel.aggregate([
                {
                    $match: { parentId: null } // Lấy danh mục cha
                },
                {
                    $lookup: {
                        from: "categories", // Tên collection (thường là categories)
                        localField: "_id",
                        foreignField: "parentId",
                        as: "children"
                    }
                }
            ]);
    
            return res.status(200).json({
                message: "Danh sách danh mục",
                listCategory: listCategory || []
            });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    getListChildcategory: async (req, res) => {
        try {
            const listChildCategory = await categoryModel.find({ parentId: req.params.id });
            return res.status(200).json({
                message: 'Danh sach',
                listChildCategory: listChildCategory || []
            });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
};

export default categoryController;