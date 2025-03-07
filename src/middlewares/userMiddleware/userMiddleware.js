import userModel from "../../models/userModel.js";
import kryptoService from "../../utils/hashing.js";

const userMiddleware = {
    checkLogin: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.send('Vui long dien day du thong tin dang nhap');
            }

            const user = await userModel.findOne({ email });

            if (!user) {
                return res.status(404).send('Email khong ton tai');
            }

            const comparepassword = kryptoService.decrypt(password, user.password);
            if (!comparepassword) {
                return res.status(404).send('Sai mat khau');
            };

            next();

        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    checkResgister: async (req, res, next) => {
        try {
            const {name, email, password } = req.body

            if (!name || !email || !password) {
                throw Error('Vui long dien day du thong tin dang ky');
            }

            const checkEmail = await userModel.findOne({ email });

            if (checkEmail) {
                throw Error('Email da ton tai');
            };

            next();
            
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}


export default userMiddleware;