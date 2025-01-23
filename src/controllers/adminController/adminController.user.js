import userModel from "../../models/userModel.js";

const manageUserController = {
    getListUser: async (req, res) => {
        try {
            const users = await userModel.find().select("-password");
            res.send(users);
        } catch (err) {
            return res.send(err.message);
        }
    },
    delete: async (req, res) => {
        const user = req.user;
        try {
            userModel.findOneAndDelete({ _id: user._id });

            return res.send("Delete user successfully!");
        } catch (err) {
            return res.send(err.message);
        }
    }
}

export default manageUserController;