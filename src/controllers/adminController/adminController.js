import fs from 'fs';
import adminModel from "../../models/adminModel.js";
import tokenService from "../../services/jwt.service.js";
import kryptoService from "../../utils/hashing.js";
import cloudinaryService from '../../services/cloudinary.service.js';

const filePath = fs.realpathSync('./');

const adminController = {
    login: async (req, res) => {
        try {
            const { email } = req.body;
            const admin = await adminModel.findOne({ email });
            const accessToken = tokenService.signAccessToken({ admin });
            const refreshToken = tokenService.signRefreshToken({ admin });
            res.cookie('refresh-Token', refreshToken, {
                signed: true,
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
            return res.status(400).send(err.message);
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
        try {
            const { email, password, name, phone, address, gender } = req.body;

            const hashPassword = kryptoService.encrypt(password);

            const approvedAdmin = new adminModel({
                email,
                password: hashPassword,
                name,
                phone,
                address,
                gender: gender || '',
                role: 'ADMIN',
                isActived: true
            });

            await approvedAdmin.save();

            return res.send('tao ADMIN thanh cong');
        }
        catch (err) {
            return res.status(400).send(err.message);
        }
    },
    create_READ_ONLY: async (req, res) => {
        try {
            const { email, password, name, phone, address, gender } = req.body;

            const hashPassword = kryptoService.encrypt(password);

            const approveReadOnly = new adminModel({
                email,
                password: hashPassword,
                name,
                phone,
                address,
                gender: gender || '',
                isActived: true
            });

            await approveReadOnly.save();

            return res.send('tao READ_ONLY thanh cong');
        }
        catch (err) {
            return res.status(400).send(err.message);
        }
    },
}

export default adminController;