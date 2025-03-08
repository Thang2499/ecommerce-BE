import e from "express";
import orderModel from "../../models/orderModel.js";
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
                res.cookie('refresh-Token',refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'Lax',
                    maxAge: 24 * 60 * 60 * 1000
                })
                return res.status(200).json({
                    message: 'Đăng nhập thành công',
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
                    message: 'Đăng ký thành công',
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
                    return res.status(404).json({message:"Bạn chưa có tài khoản cá nhân"});
                }

                const existingShop = await shopModel.findOne({userId});
                if (existingShop) {
                    return res.status(400).json({message:"Yêu cầu của bạn đang chờ phê duyệt"});
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
                    message:"Yêu cầu của bạn đã được gửi",
                    // shop: newShop,

                });
            } catch (err) {
                console.error(err);
                res.status(500).json({message:"Lỗi khi gửi yêu cầu", error: err.message})
            }
        },
        viewOrder: async (req,res) => {
            try {
                const {user} = req.user;
                const findOrder = await orderModel.find({userId:user._id}).populate({
                    path:'items.itemId',
                    model:'items',
                    populate: {
                        path: 'productId',
                        model: 'products',
                        select: 'productName image'
                      },
                })
                res.send(findOrder)
            } catch (error) {
                res.status(400).send({
                    message: error.message
                })
            }
        },
        editProfile: async (req,res) => {
            try {
                const {user} = req.user;
                const {name, email, phone, address} = req.body;
                const updateUser = await userModel.findByIdAndUpdate(user._id, {
                    name: name,
                    email: email,
                    phone: phone,
                    address:address
                })
                res.status(200).send(updateUser)
            } catch (error) {
                res.status(400).send({
                    message: error.message
                })
            }
        },
        fetchUserInfo: async (req,res) => {
            const {user} = req.user;
            const userInfo = await userModel.findById(user._id);
            res.status(200).send(userInfo);
        }
    }
export default userController;