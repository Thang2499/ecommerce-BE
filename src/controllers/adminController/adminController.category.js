import categoryModel from "../../models/categoryModel.js";

const categoryController = {
    create: async (req, res) => {
        try {
            const { name, description, image, parentId } = req.body;

            const category = new categoryModel({
                name,
                description,
                image,
                parentId
            });

            await category.save();

            res.status(200).json({ message: 'Tạo danh mục thành công' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
}

export default categoryController