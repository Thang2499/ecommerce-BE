import jwt from "jsonwebtoken";
import { config } from "dotenv";
import userModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";
config();

class tokenHandler {
    //tạo accessToken
    signAccessToken(payload) {
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
        return token;
    };
    //tạo refreshToken
    signRefreshToken(payload) {
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '365d' });
        return token;
    };
    //decode token
    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            return decoded;
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return { status: 401, message: 'Token expired' };
            } else {
                return { status: 401, message: 'Invalid token' };
            }
        }
    }

    // hàm lấy lại refreshToken khi accessToken hết hạn cho users
    refreshAccessToken = async (req, res) => {
        try {
            const getRefreshToken  = req.cookies;
            const refreshToken = getRefreshToken['refresh-Token'];
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token is required' });
            }
          jwt.verify(refreshToken, process.env.SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid refresh token' });
                }
                const { _id, role } = decoded.user;
                
                let user;
                if (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'READ_ONLY') {
                    user = await adminModel.findById(_id);
                } else if (role === 'customer') {
                    user = await userModel.findById(_id).populate({
                        path: 'shopId',
                        model: 'shops'
                    });
                } else {
                    return res.status(400).json({ message: 'Invalid user role' });
                }
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const newAccessToken = jwt.sign(
                    { user: user },
                    process.env.SECRET_KEY,
                    { expiresIn: '1d' }
                );

                return res.status(200).json({ accessToken: newAccessToken });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}
const tokenService = new tokenHandler();

export default tokenService;