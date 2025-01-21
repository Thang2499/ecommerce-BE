import multer from 'multer';
import path from 'path';
import fs from 'fs';
class imageHandler {
    saveSingleImg() {
        try {
        const storage = multer.memoryStorage();
        // diskStorage({
        //     destination: (req, file, cb) => {
        //         const uploadDir = 'image/';
        //         const uploadPath = path.join(uploadDir,folder? folder : '');
        //         console.log("Go here 3", uploadPath)

        //         // Kiểm tra và tạo thư mục nếu không tồn tại
        //         fs.mkdir(uploadPath, { recursive: true }, (err) => {
        //             if (err) {
        //                 console.log('loi');
        //                 return cb(err);
        //             }
        //             cb(null, uploadPath);
        //         });
        //     },
        //     filename: (req, file, cb) => {
        //         cb(null, `${Date.now()}_${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`);
        //     }
        // });
        console.log("Go here1")
        const upload = multer({ storage: storage });
        console.log("Go here2")

        return (req, res, next) => {
            upload.fields([
                { name: 'image', maxCount: 1 },
                { name: 'imageDetail', maxCount: 4 }
            ])(req, res, (err) => {
                if (err) {
                    return res.status(400).json({ error: 'Error uploading file', details: err });
                }
                // if (!req.files || !req.files.image || !req.files.image[0].buffer) {
                //     console.log('this ran')
                //     next();
                // }

                next();
            });
        };
    } catch(err) {
        throw (
            { message: err.message || err }
        )
    }

}
    // saveMultipleImg() {
    //     try {
    //         const storage = multer.diskStorage({
    //             destination: (req, file, cb) => {
    //                 cb(null, `images/${path}/`)
    //             },
    //             filename: (req, file, cb) => {
    //                 cb(null, (`${Date.now()}_${Math.random(1000)}`) + '.jpg')
    //             }
    //         })
    //         const upload = multer({ storage: storage }).array(path);
    //         return upload.fields([
    //             { name: 'imageDetail', maxCount: 4 }
    //         ]);
    //     }
    //     catch (err) {
    //         throw (
    //             { message: err.message || err }
    //         )
    //     }
    // }
}

export const imageService = new imageHandler();
// export default imageService;