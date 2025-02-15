import adminModel from "../../models/adminModel.js";
import tokenService from "../../services/jwt.service.js";
import kryptoService from "../../utils/hashing.js";
import cloudinaryService from '../../services/cloudinary.service.js';

const adminController = {
    login: async (req, res) => {
        const { email } = req.body;
        try {
            const admin = await adminModel.findOne({ email, isActive: true });
            const accessToken = tokenService.signAccessToken({ admin });
            const refreshToken = tokenService.signRefreshToken({ admin });
            res.cookie('refresh-Token', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 24 * 60 * 60 * 1000
            })
            return res.json({
                message: 'Dang nhap thanh cong',
                accessToken,
                admin
            });
        }
        catch (err) {
            return res.send(err.message);
        }
    },
    listAdmin: async (req, res) => {
        const { page = 1, limit = 20 } = req.query; 
    
        const startPo = (page - 1) * limit; 
        const endPo = startPo + limit;   
    
        try {
            const totalAdmin = await adminModel.countDocuments();
    
            const totalPages = Math.ceil(totalAdmin / limit);
    
            const adminList = await adminModel
                .find()
                .skip(startPo)
                .limit(limit);
    
            if (adminList.length > 0) {
                res.status(200).send({
                    adminList,
                    currentPage: page,
                    totalPages,
                    totalAdmin,
                    limit
                });
            } else {
                res.status(404).send({ message: "No admin list found for this shop." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error while getting admin list" });
        }
},
    create_ADMIN: async (req, res) => {
        const { email, password, name, phone, address, gender } = req.body;
        try {
            const hashPassword = kryptoService.encrypt(password);

            const approvedAdmin = new adminModel({
                email,
                password: hashPassword,
                name,
                phone,
                address,
                gender: gender || '',
                role: 'ADMIN',
                isActive: true
            });

            await approvedAdmin.save();

            return res.status(201).send('tao ADMIN thanh cong');
        }
        catch (err) {
            return res.send(err.message);
        }
    },
    create_READ_ONLY: async (req, res) => {
        const { email, password, name, phone, address, gender } = req.body;
        try {
            const hashPassword = kryptoService.encrypt(password);

            const approveReadOnly = new adminModel({
                email,
                password: hashPassword,
                name,
                phone,
                address,
                gender: gender || '',
                isActive: true
            });

            await approveReadOnly.save();

            return res.status(201).send('tao READ_ONLY thanh cong');
        }
        catch (err) {
            return res.send(err.message);
        }
    },
    update: async (req, res) => {
        const { password, phone, address, gender } = req.body;
        const admin = req.admin;
        const { image } = req.files;
        try {
            let mainImageUrl;
            let newPassword

            if (image) {
                const mainImagePath = image[0];
                const uploadedMainImage = await cloudinaryService.postSingleImage(mainImagePath, 'avatar');
                mainImageUrl = uploadedMainImage.secure_url;
            }

            if(password) {
                newPassword = kryptoService.encrypt(password);
            }

            const newAdmin = await adminModel.findOneAndUpdate({ _id: admin._id }, {
                // only accept new password, phone, address, avatar, gender
                password: newPassword || admin.password,
                phone: phone || admin.phone,
                address: address || admin.address,
                avatar: mainImageUrl || admin.image,
                gender: gender || admin.gender
            }, { new: true });

            const accessToken = tokenService.signAccessToken({ newAdmin });
            const refreshToken = tokenService.signRefreshToken({ newAdmin });
            res.cookie('refresh-Token', refreshToken, {
                signed: true,
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 24 * 60 * 60 * 1000
            })
            return res.json({
                message: 'Cap nhat thanh cong',
                accessToken,
                admin: newAdmin
            });
        }
        catch (err) {
            return res.send('a');
        }
    }
}

export default adminController;