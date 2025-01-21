import mongoose from "mongoose";
const roles = ["SUPER_ADMIN", "ADMIN", "READ_ONLY"];
const genders = ["M", "F", ""];
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        require: true
    },
    email: {
        type: String,
        unique: true,
        // require: true
    },
    password: {
        type: String,
        require: true
    },
    avatar: {
        type: String, // url
        default: "https://freesvg.org/img/abstract-user-flat-4.png"
    },
    role: {
        type: String,
        enum: roles,
        default: "READ_ONLY",
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        enum: genders,
        default: ""
    },
    isActived: {
        type: Boolean,
        default: false
    },
})

const adminModel = mongoose.model('admins', adminSchema);

export default adminModel;