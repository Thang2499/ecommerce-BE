import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    text: {
        type: String,
        require: true
    },
    parentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    },
    timestamp: {
        type: String,
        require: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        require: true
    },
})

const commentModel = mongoose.model('comments', commentSchema);
export default commentModel;