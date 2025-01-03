import userModel from "../../models/userModel";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import tokenService from "../../services/jwt.service";


const userController = {
    login: async (req,res) => {
        try {
            const {email, password} = req.body;
            if (!email, !password) {
                return res.status(400).json({ message: 'Thieu Email hoac Mat khau'});
            }   
            const user = await userModel.findOne({email});
                if (!user) {
                    return res.status(400).json({ message: 'Email hoac mat khau khong hop le'});
                }
            const passwordValid = await bcrypt.compare(password, user.password);
            if(!passwordValid) {
                return res.status(400).json({message: 'Email hoac mat khau khong hop le'})
            }
            const accessToken = tokenService.signAccessToken({user});
            const refreshToken = tokenService.signRefreshToken({user});
            res.status(200).json({
                message: 'Dang nhap thanh cong',
                accessToken,
                refreshToken,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Loi roi'})
                }
    },

    register: async (res,req) => {
        try {
            const {name, password, email} = req.body;
            if (!name || !password || !email) {
                return res.status(400).json({message:'Loi roi'});
            } 
            const existingUser = await userModel.findOne({email});
            if (!existingUser) {
                return res.status(400).json ({message:'Email da ton tai'})
            }
            const hashPassword = await bcrypt.hash(password,10);
            const newUser = new userModel({
                name,
                email,
                password: hashPassword,
            });

            await newUser.save();

            const accessToken = tokenService.signAccessToken({user: newUser});
            const refreshToken = tokenService.signRefreshToken({user: newUser});
            
            res.status(201).json({
                message: 'Dang ky thanh cong',
                accessToken,
                refreshToken,
            });
        } catch(error) {
            console.error(error);
            res.status(500).json({message:'Loi roi'})
        }
    },

    refreshToken: async (req,res) => {
        try {
            const {refreshToken} = req.body

            if(!refreshToken) {
                return res.status(401).json({message: 'Token is required'});
            }
            jwt.verify(refreshToken, process.env.SECREY_KEY, async(err, decoded)=> {
                if (err) {
                    return res.status(403).json({message:'Token khong hop le'});
                }
                const userId = decoded.user._id;
                const user = await userModel.findById(userId).populate({
                    path: 'shopId',
                    model: 'shops',
                });
                if (!user) {
                    return res.status(401).json({message:'User khong hop le'})
                }
                const newAccessToken = tokenService.signAccessToken({user});
                res.status(200).json({accessToken: newAccessToken});
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Loi roi'})
        }
    }
}
export default userController;