import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "admins", // tham chiếu tới bảng admin
        required: true
    },
    role: {
        type: String, 
        enum: ["SUPER_ADMIN"], // chỉ có super admin mới có quyền tạo category
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const categoryModel = mongoose.Model('category', categorySchema);
export default categoryModel;