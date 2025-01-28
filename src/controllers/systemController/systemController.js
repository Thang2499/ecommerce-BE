import itemModel from "../../models/itemModel.js";
import productModel from "../../models/productModel.js";
import userModel from "../../models/userModel.js";

const systemController = {
    getProductsList: async (req, res) => {
        const { page = 1, limit = 20 } = req.query; 
    
        const startPo = (page - 1) * limit; 
        const endPo = startPo + limit;   
        try {
            const totalProduct = await productModel.countDocuments();
    
            const totalPages = Math.ceil(totalProduct / limit);
    
            const getProductsList = await productModel
                .find()
                .skip(startPo)
                .limit(limit);
    
            if (getProductsList.length > 0) {
                res.status(200).send({
                    getProductsList,
                    currentPage: page,
                    totalPages,
                    totalProduct,
                    limit
                });}
        } catch (error) {
            res.status(500).send({message: "Error while getting products list"});
        }
    },
    getCart : async (req, res) => {
        try {
            const {id} = req.body;
            const user = await userModel.findById(id);
            const cart = user.cart;
            const itemIds = cart.map(item => item.itemId);
          
            const itemsInCart = await itemModel.find({ _id: { $in: itemIds } }).populate({
                path: 'productId',
                model: 'products'
            });
            res.status(200).json({
                success: true,
                itemsInCart
            });
        } catch (error) {
            res.status(500).send({message: "Error while getting cart"})
        }
    },
    getWistList : async (req, res) => {
        const { id } = req.body;

        try {
            const user = await userModel.findById(id).populate('wishlist.productId');
            if(user.wishlist){
                res.status(200).send(user.wishlist);
            }else{
                res.status(404).send({message: "Cart not found"});
            }
        } catch (error) {
            res.status(500).send({message: "Error while getting cart"})
        }
    },
    addWishList: async (req, res) => {
        const {id} = req.params;
        const {wishList} = req.body
        try {
            const user = await userModel.findByIdAndUpdate(id, {
                $addToSet: { wishlist: { $each: wishList } }
            },
                { new: true })
            res.status(200).send({
                message: 'success',
                user
            })
        } catch (err) {
            res.send({
                message: err.message
            })
        }
    },
    removeFromWishList: async (req, res) => {
        try {
            const { id, userId } = req.body;
            const user = await userModel.findByIdAndUpdate(
                userId,
                {
                    $pull: { wishlist: { productId: id } },
                },
                { new: true }
            );
            res.status(200).json({
                message: 'Xóa sản phẩm khỏi wishlist thành công!',
                wishlist: user.wishlist,
            });
        } catch (err) {
            res.status(500).json({
                message: 'Lỗi khi xóa sản phẩm khỏi wishlist.',
                error: err.message,
            });
        }
    },
    addToCart: async (req, res) => {
        try {
            const { id, productId, quantity, unitPrice } = req.body;
            const user = await userModel.findById(id);
            const existingItem = await itemModel.findOne({
                productId,
                userId: id,
            });
            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.totalPrice = existingItem.quantity * unitPrice;
                const updatedItem = await existingItem.save();

                return res.status(200).json({
                    message: 'Cập nhật sản phẩm trong giỏ hàng thành công!',
                    item: updatedItem,
                });
            }
            const newItem = new itemModel({
                productId,
                userId: id,
                quantity,
                unitPrice,
                totalPrice: quantity * unitPrice,
            });
            const savedItem = await newItem.save();
            if (!user.cart.find((item) => item.itemId === savedItem._id.toString())) {
                user.cart.push({ itemId: savedItem._id });
                await user.save();
            }
            await user.save();
            res.status(200).send({
                message: 'success',
                user
            })
        } catch (err) {
            res.send({
                message: err.message
            })
        }
    },
    
}
export default systemController;