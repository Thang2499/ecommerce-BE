import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import stream from 'stream';

config();
const cloudinaryConfig = {
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
}
cloudinary.config(cloudinaryConfig);

class imageHandler {
  
    async postSingleImage(file, folder) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                public_id: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
                folder: '/e_commerce/' + folder
            }, (error, result) => {
                if (error) {
                    reject(error);  
                } else {
                    resolve(result); 
                }
            });
    
            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer); 
    
            bufferStream.pipe(uploadStream);  
        });
    }

    async postMultipleImages(imagesPath, folder) {
        let result = []; 
        const uploadPromises = imagesPath.map((file) => {
            return new Promise((resolve, reject) => {
                try {
                    const bufferStream = new stream.PassThrough();
                    bufferStream.end(file.buffer);  
    
                    // Sử dụng upload_stream để upload ảnh lên Cloudinary
                    const uploadStream = cloudinary.uploader.upload_stream({
                        public_id: `${Date.now()}_${Math.random().toString(36).substring(7)}`, 
                        folder: '/e_commerce/' + folder, 
                    }, (error, uploadResult) => {
                        if (error) {
                            return reject(error);  
                        }
                        result.push(uploadResult); 
                        resolve(uploadResult); 
                    });
    
                    bufferStream.pipe(uploadStream);
                } catch (error) {
                    reject(error);  
                }
            });
        });
    
        await Promise.all(uploadPromises);
    
        return result;
    }
}
const cloudinaryService = new imageHandler();
export default cloudinaryService