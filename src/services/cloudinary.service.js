import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import fs from 'fs';

config();

// tạo thư mục cloudinary mới
const cloudinaryConfig = {
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
}
cloudinary.config(cloudinaryConfig);

// 1 image at a time
class imageHandler {
    // anh nghĩ tên folder trên cloudinary khai báo cứng luôn như: const folderCloudinary = "imageSource" rồi gán vào param của methods luôn, tránh trường hợp ghi lại nhiều lần sai tên folder
    async postSingleImage(filePath, folder) {
        try {
            const res = await cloudinary.uploader.upload(filePath, {
                public_id: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                folder: '/e_commerce/' + folder
            });
            return res;
        } catch (err) {
            try {
                // delete the file if it fails to upload
                fs.unlinkSync(filePath);
            } catch (unlinkErr) {
                console.error('Failed to delete local file:', unlinkErr);
            }
            return err;
        }
    }

    // usage:
    // const imageData = await cloudinaryService.postSingleImage(`filePath, 'folder')
    // let image = imageData.url
    // 
    // delete filePath
    // 
    // fs.unlinkSync(`filePath`)
    // console.log(image) to print the image URL
    // ---------------------------------------------------------------------------------------------------------------------

    // multiple images at a time
    async postMultipleImages(imagesPath, folder) {
        let result = []; // Mảng kết quả sẽ chứa tất cả thông tin của các ảnh đã upload
        // Dùng map để xử lý từng ảnh
        const uploadMultipleImages = imagesPath.map(async (file) => {  // 'file' là từng file ảnh trong mảng
            const filePath = file.path;  // Lấy đường dẫn của từng file
            try {
                const response = await cloudinary.uploader.upload(filePath, {
                    public_id: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    folder: '/e_commerce/' + folder
                });
                result.push(response);  // Thêm kết quả của từng ảnh vào mảng result
                return response;  // Trả về thông tin của từng ảnh
            } catch (error) {
                try {
                    fs.unlinkSync(filePath);  // Xóa file nếu có lỗi
                } catch (unlinkErr) {
                    console.error(`Failed to delete local file: ${filePath}`, unlinkErr);
                }
                return { error: error.message };  // Trả về lỗi nếu có lỗi
            }
        });
        
        // Đợi tất cả các ảnh hoàn thành upload
        await Promise.all(uploadMultipleImages);  // Đảm bảo tất cả các ảnh đã được upload xong
        
        return result;  // Trả về mảng chứa thông tin tất cả các ảnh đã upload
    }
}
const cloudinaryService = new imageHandler();
export default cloudinaryService