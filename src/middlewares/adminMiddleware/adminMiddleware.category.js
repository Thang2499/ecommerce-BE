import categoryModel from "../../models/categoryModel.js";

const categoryMiddleware = {
    create: async (req, res, next) => {
        const { name } = req.body;
        try {
            if (!name) {
                return res.send('Vui long dien day du thong tin');
            }

            const category = await categoryModel.findOne({ name });

            if (category) {
                return res.send('Danh muc da ton tai');
            }

            next();
        } catch (err) {
            return res.send(err.message);
        }
    },
    update: async (req, res, next) => {
        const { id } = req.params;
        const {name, description} = req.body;
        try {
            const category = await categoryModel.findOne({ _id: id });

            if (!category) {
                return res.send('Danh muc khong ton tai');
            }

            if(!name && !description && !req.files) {
                return res.send('Vui long dien thong tin can thay doi');
            }

            next();
        }
        catch (err) {
            return res.send(err.message);
        }
    },
    delete: async (req, res, next) => {
        const { id } = req.params;
        try {
            const category = await categoryModel.findOne({ _id: id });

            if (!category) {
                return res.send('Danh muc khong ton tai');
            }

            next();
        }
        catch (err) {
            return res.send(err.message);
        }
    }
}

export default categoryMiddleware;