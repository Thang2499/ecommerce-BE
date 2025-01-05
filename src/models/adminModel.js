import mongoose from "mongoose";
const roles = ["SUPER_ADMIN", "ADMIN", "READ_ONLY"];
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true
        // require:true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: roles,
        default: "ADMIN",
        require: true
    },
    phone: {
        type: String,
        // require:true
    },
    address: {
        type: String
    },
    gender: {
        type: String
    },
})

const adminModel = mongoose.model('admins', adminSchema);

export default adminModel;