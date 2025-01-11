import jwt from "jsonwebtoken"


    export const authenticateUser = async ( req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Truy cap bi tu choi"});
        }
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(400).json({ message: "Ma khong hop le"})
        }
    }


