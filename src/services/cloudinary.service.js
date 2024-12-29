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
        try{
            const res = await cloudinary.uploader.upload(filePath, { 
                public_id: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                folder 
            });
            return res;
        }catch(err){
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
        let result = [];
        //Nhận vào 1 mảng các url image và map ra từng url
        const uploadMultipleImages = imagesPath.map(async (filePath)=>{
            try {
                const response = await cloudinary.uploader.upload(filePath, {
                    public_id: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    folder,
                })
                result.push(response);  // thêm vào result từng url image được cloudinary trả về
                return response; // trả về từng url image từ cloudinary
            } catch (error) {
                try {
                    fs.unlinkSync(filePath);
                } catch (unlinkErr) {
                    console.error(`Failed to delete local file: ${filePath}`, unlinkErr);
                }
                return { error: err };
            }
        })
        await Promise.all(uploadMultipleImages); // đợi khi tất cả url image tải lên được cloudinary trả về mới trả ra result
        return result;

        // for (const image in imagesPath) {
        //     const response = await cloudinary.uploader.upload(imagesPath[image], { public_id: Math.ceil(Math.random() * Date.now() + Math.random() * Date.now()), folder }, ((err, res) => {
        //         if (err) {
        //             // delete the file if it fails to upload
        //             result.map(e => fs.unlinkSync(e))
        //             return err.error;
        //         }
        //     }));
        //     result.push(response)
        // }
        // return result;

    }
}
const cloudinaryService = new imageHandler();
export default cloudinaryService