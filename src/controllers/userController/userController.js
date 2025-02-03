import shopModel from "../../models/shopModel.js";
import userModel from "../../models/userModel.js";
import tokenService from "../../services/jwt.service.js";
import kryptoService from "../../utils/hashing.js";

const userController = {
        login: async (req, res) => {
            try {
                const { email } = req.body;
                const user = await userModel.findOne({ email }).populate({
                    path: 'shopId',
                    model: 'shops'
                });;
                const accessToken = tokenService.signAccessToken({ user });
                const refreshToken = tokenService.signRefreshToken({ user });
                const cc = res.cookie('refresh-Token',refreshToken, {
                    // signed: true,
                    httpOnly: true,
                    secure: false,
                    sameSite: 'Lax',
                    maxAge: 24 * 60 * 60 * 1000
                })
                return res.status(200).json({
                    message: 'Dang nhap thanh cong',
                    accessToken,
                    refreshToken,
                    user:user
                });
            } catch (err) {
                return res.status(400).json({ message: `Unknown bug, ${err.message}` });
            }
        },

        register: async (req, res) => {
            try {
                const { name, password, email } = req.body;
                const hashPassword = kryptoService.encrypt(password);
                const newUser = new userModel({
                    name,
                    email,
                    password: hashPassword,
                });

                await newUser.save();

                const accessToken = tokenService.signAccessToken({ user: newUser });
                const refreshToken = tokenService.signRefreshToken({ user: newUser });

                return res.status(201).json({
                    message: 'Dang ky thanh cong',
                    accessToken,
                    refreshToken,
                });
            } catch (err) {
                return res.status(400).json({ message: `Unknown bug, ${err.message}` });
            }
        },
        requestSeller: async (req, res) => {
            const { shopName, phoneNumber, description, address } = req.body

            try {
                const userId = req.user.user._id;
                const user = await userModel.findById(userId);
                if (!user) {
                    return res.status(404).json({message:"Nguoi dung khong ton tai"});
                }

                const existingShop = await shopModel.findOne({userId});
                if (existingShop) {
                    return res.status(400).json({message:"Chi duoc phep tao 1 cua hang"});
                }
                const newShop = new shopModel({
                    userId: userId,
                    name: shopName,
                    email: user.email,
                    phone: phoneNumber,
                    description,
                    address,
                });
                await newShop.save();
                await userModel.findByIdAndUpdate(userId, {shopId: newShop._id});
                res.status(201).json({
                    message:"Yeu cau tro thanh nguoi ban da gui, vui long doi phe duyet",
                    shop: newShop,

                });
            } catch (err) {
                console.error(err);
                res.status(500).json({message:"Loi khi gui yeu cau", error: err.message})
            }
        },
    }
export default userController;