import tokenService from "../../services/jwt.service.js";
import adminModel from "../../models/adminModel.js";

const adminToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        const decodedToken = tokenService.verifyToken(token);

        if(decodedToken.status === 401) {
            return res.send(decodedToken.message);
        }

        const admin = await adminModel.findById(decodedToken.admin._id);

        if (!admin || !admin.isActived) {
            return res.send('Tai khoan khong ton tai');
        }

        req.admin = admin;

        next();
    }
    catch(err) {
        return res.send(err.message);
    }
}

export default adminToken;