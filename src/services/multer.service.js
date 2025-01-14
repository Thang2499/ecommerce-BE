import multer from 'multer';

class imageHandler {
    saveSingleImg(path) {
        try {
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, `images/${path}/`)
                },
                filename: (req, file, cb) => {
                    cb(null, (`${Date.now()}_${Math.random(1000)}`) + '.jpg')
                }
            })
            const upload = multer({ storage: storage })
            return upload.single(path)
        }
        catch (err) {
            throw (
                { message: err.message || err }
            )
        }
    }
    saveMultipleImg(path) {
        try {
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, `images/${path}/`)
                },
                filename: (req, file, cb) => {
                    cb(null, (`${Date.now()}_${Math.random(1000)}`) + '.jpg')
                }
            })
            const upload = multer({ storage: storage }).array(path);
            return upload
        }
        catch (err) {
            throw (
                { message: e.message || e }
            )
        }
    }
}

export const imageService = new imageHandler()