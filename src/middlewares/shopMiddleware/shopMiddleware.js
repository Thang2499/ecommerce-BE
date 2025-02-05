import shopModel from "../../models/shopModel.js";
import userModel from "../../models/userModel.js";
import tokenService from "../../services/jwt.service.js";


const shopMiddleware = {
    shopToken : async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).send("Unauthenticated")
             }
            const decodedToken = tokenService.verifyToken(token);
    
            if(decodedToken.status === 401) {
                return res.status(401).send(decodedToken.message);
            }
            const user = await userModel.findById(decodedToken.user._id);
    
            if (!user ) {
                return res.send('Tai khoan khong ton tai');
            }
    
            const shopId = await shopModel.findById(user.shopId);
            if(!shopId){
              return  res.status(404).send('Shop not found');
            }
            req.user = user;
    
            next();
        }
        catch(err) {
            return res.send(err.message);
        }
    }
}
export default shopMiddleware;