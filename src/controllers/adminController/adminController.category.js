import categoryModel from "../../models/categoryModel.js";
import cloudinaryService from "../../services/cloudinary.service.js";

const categoryController = {
    create: async (req, res) => {
        try {
            let categoryImg = 'https://freesvg.org/img/abstract-user-flat-4.png';
            // anh có thể đặt link default img là link khác cho category, đây là link tạm thời em để
            // if (image) {
            //     const mainImagePath = image[0];
            //     const uploadedMainImage = await cloudinaryService.postSingleImage(mainImagePath, 'category');
            //     categoryImg = uploadedMainImage.secure_url;
            // }
            if (req.files && req.files.image) {
                const image = req.files.image;
                const mainImagePath = image[0]; // Đảm bảo rằng image có cấu trúc đúng nếu là array
                const uploadedMainImage = await cloudinaryService.postSingleImage(mainImagePath, 'category');
                categoryImg = uploadedMainImage.secure_url;
            }


            const { name, description, parentId } = req.body;
            const admin = req.admin;

            const category = new categoryModel({
                name: name,
                description: description || '',
                image: categoryImg,
                parentId: parentId || null,
                createdBy: admin._id,
                role: admin.role
            });

            await category.save();

            return res.send('Tạo danh mục thành công');
        } catch (err) {
            return res.send(err.message);
        }
    },
    update: async (req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;
        const { image } = req.files;
        try {
            const oldCategory = await categoryModel.findOne({ _id: id });

            let categoryImg;
            if (image) {
                const mainImagePath = image[0];
                const uploadedMainImage = await cloudinaryService.postSingleImage(mainImagePath, 'category');
                categoryImg = uploadedMainImage.secure_url;
            }


            const updatedCatefory = await categoryModel.findOneAndUpdate({ _id: id }, {
                name: name || oldCategory.name,
                description: description || oldCategory.description,
                image: categoryImg || oldCategory.image
            }, { new: true });

            return res.send(updatedCatefory);
        }
        catch (err) {
            return res.send(err.message);
        }
    },
    delete: async (req, res) => {
        const category = req.category;
        try {
            if (!category.parentId) {
                await categoryModel.deleteMany({ parentId: category._id })
            }
            
            await categoryModel.findByIdAndDelete(category._id);

            return res.send('Xoa thanh cong')
        }
        catch (err) {
            return res.send(err.message);
        }
    }
}
export default categoryController