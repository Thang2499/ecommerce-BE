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
    async postSingleImage(filePath, folder) {
        return await cloudinary.uploader.upload(filePath, { public_id: Math.ceil(Math.random() * Date.now() + Math.random() * Date.now()), folder }, (err, res) => {
            if (err) {
                // delete the file if it fails to upload
                fs.unlinkSync(filePath);
                return err.error;
            }
        })
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
        for (const image in imagesPath) {
            const response = await cloudinary.uploader.upload(imagesPath[image], { public_id: Math.ceil(Math.random() * Date.now() + Math.random() * Date.now()), folder }, ((err, res) => {
                if (err) {
                    // delete the file if it fails to upload
                    result.map(e => fs.unlinkSync(e))
                    return err.error;
                }
            }));
            result.push(response)
        }
        return result;

    }
}
const cloudinaryService = new imageHandler();
export default cloudinaryService