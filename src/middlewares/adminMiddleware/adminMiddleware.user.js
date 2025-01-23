import userModel from "../../models/userModel.js";
import userModel from "../../models/userModel.js";

const manageUserMiddleware = {
    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await userModel.findById(id);
            
            if (!user) {
                return res.send("User not found");
            }

            req.user = user;
            
            if (user.role === "ADMIN") {
                return res.send("Cannot delete ADMIN");
            }

            next();
        } catch (err) {
            return res.send(err.message);
        }
    }
}

export default manageUserMiddleware;