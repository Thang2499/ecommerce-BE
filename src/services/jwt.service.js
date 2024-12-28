import jwt from "jsonwebtoken";
import { config } from "dotenv";
import userModel from "../models/userModel.js";
config();

class tokenHandler {
  //tạo accessToken
  signAccessToken(payload) {
    const token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'1d'});
    return token;
  };
  //tạo refreshToken
  signRefreshToken(payload) {
    const token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'365d'});
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
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        jwt.verify(refreshToken, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }
            const userId = decoded.user._id;
            const user = await userModel.findById(userId).populate({
                path: 'shopId',
                model: 'shops'
            });
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            const newAccessToken = jwt.sign(
                { user:user},
                process.env.secretKey,
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