import categoryModel from "../../models/categoryModel.js";

const categoryController = {
    create: async (req, res) => {
        try {
            const { name, description, image, parentId } = req.body;
            console.log(parentId);
            const admin = req.admin;
            const category = new categoryModel({
                name: name,
                description: description || '',
                image: image || '',
                parentId: parentId || null,
                createdBy: admin.admin._id,
                role: admin.admin.role
            });

            await category.save();

            return res.status(200).json({ message: 'Tạo danh mục thành công' });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
}

export default categoryController