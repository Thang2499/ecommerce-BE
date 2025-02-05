import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

    export const authenticateUser = async ( req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Truy cap bi tu choi"});
        }
        try {
            const decoded = jwt.verify(token,process.env.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(400).json({ message:error.message});
        }
    }


