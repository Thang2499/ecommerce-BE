import fs from 'fs';
import categoryModel from "../../models/categoryModel.js";
import cloudinaryService from "../../services/cloudinary.service.js";

const filePath = fs.realpathSync('./')

const categoryController = {
    create: async (req, res) => {
        try {
            const { name, description, image, parentId } = req.body;
            const admin = req.admin;
            
            const category = new categoryModel({
                name: name,
                description: description || '',
                image: categoryImg || '',
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
    update: async (req, res) => {
        try{
            const { id } = req.params;
            const { name, description } = req.body;

            let categoryImg;
            if (req.file) {
                const categoryData = await cloudinaryService.postSingleImage(`${filePath}\\${req.file.path}`, 'category');
                categoryImg = categoryData.url;
                fs.unlinkSync(`${filePath}\\${req.file.path}`)
            }

            const oldCategory = await categoryModel.findOne({ _id: id });

            const updatedCatefory = await categoryModel.findOneAndUpdate({ _id: id }, {
                name: name || oldCategory.name,
                description: description || oldCategory.description,
                image: categoryImg || oldCategory.image
            }, { new: true });

            return res.status(200).json({ message: 'Sửa danh mục thành công', category: updatedCatefory });
        }
        catch(err){
            return res.status(400).json({ message: err.message });
        }
    }
}

export default categoryController