import userModel from "../../models/userModel.js";

const manageUserController = {
    getListUser: async (req, res) => {
        try {
            const users = await userModel.find().select("-password");
            res.json(users);
        } catch (err) {
            return res.send(err.message);
        }
    }
}

export default manageUserController;