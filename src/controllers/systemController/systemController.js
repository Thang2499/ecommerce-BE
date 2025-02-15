import itemModel from "../../models/itemModel.js";
import orderModel from "../../models/orderModel.js";
import productModel from "../../models/productModel.js";
import shopModel from "../../models/shopModel.js";
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
        const { id } = req.params; 
        const { wishList } = req.body;
    
        try {
            const user = await userModel.findById(id);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const existingProductIds = user.wishlist.map(item => item.productId.toString()); // Lấy danh sách productId đã có
            const newWishList = wishList.filter(item => !existingProductIds.includes(item.productId)); // Lọc sản phẩm chưa có
    
            if (newWishList.length === 0) {
                return res.status(200).send({ message: "Sản phẩm đã có trong wishlist" });
            }
            const updatedUser = await userModel.findByIdAndUpdate(
                id,
                { $addToSet: { wishlist: { $each: newWishList } } },
                { new: true }
            );
    
            res.status(200).send({
                message: "Thêm vào wishlist thành công",
                user: updatedUser
            });
        } catch (err) {
            res.status(500).send({ message: err.message });
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
    removeFromCart: async (req, res) => {
        try {
            const { userId, itemId } = req.body;
            const deletedItem = await itemModel.findByIdAndDelete(itemId);
            if (!deletedItem) {
                return res.status(404).json({
                    message: 'Không tìm thấy mục trong giỏ hàng.',
                });
            };
            const user = await userModel.findByIdAndUpdate(
                userId,
                {
                    $pull: { cart: { itemId } },
                },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({
                    message: 'Không tìm thấy người dùng.',
                });
            };
            res.status(200).send('Delete success');
        } catch (err) {
            res.status(500).json({
                message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng.',
                error: err.message,
            });
        }
    },
    viewCart: async (req, res) => {
      
        try {
            const user = req.user;
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
            console.error('Error fetching cart items:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch cart items',
            });
        }
    },
    createOrder: async (req, res) => {
        const { address, selectedPayment, fee } = req.body
        const user = req.user;
        try {
            const userCart = await userModel.findById(user.user._id).populate({
                path: 'cart.itemId',
                populate: {
                    path: 'productId',
                    select: 'shopId price productName image',
                },
            });
            const itemsByShop = userCart.cart.reduce((acc, cartItem) => {
                const shopId = cartItem.itemId.productId.shopId.toString();
                if (!acc[shopId]) acc[shopId] = [];
                acc[shopId].push(cartItem);
                return acc;
            }, {});
            const orders = [];
            // const itemIdsToDelete = [];
            for (const shopId in itemsByShop) {
                const items = itemsByShop[shopId];

                let totalAmount = items.reduce((sum, item) => {
                    return parseFloat(item.itemId.unitPrice) * parseFloat(item.itemId.quantity) + parseFloat(sum) + parseFloat(fee);
                }, 0);
                if (selectedPayment === 'Momo') {
                    totalAmount = 0
                }
                const order = await orderModel.create({
                    userId: user.user._id,
                    shopId,
                    items: items.map(item => ({
                        itemId: item.itemId._id,
                    })),
                    totalAmount: Number(totalAmount),
                    paymentMethod: selectedPayment,
                    shippingAddress: address,
                });

                orders.push(order);
            }
            
            for (const order of orders) {
                await shopModel.updateOne(
                    { _id: order.shopId },
                    { $push: { orderIds: order._id } }
                );
            }
            await userModel.updateOne(
                { _id: user.user._id },
                { cart: [] }
            );
            // if (itemIdsToDelete.length > 0) {
            //     await itemModel.deleteMany({ _id: { $in: itemIdsToDelete } });
            // }
            return res.send({
                message: 'create success',
            })
        } catch (error) {
            return res.send({
                message: error.message
            })
        }
    },
    productDetail: async (req,res) => {
        const id = req.body;
        try {
            const product = await productModel.findById(id.id);
           res.status(200).send(product)
        } catch (error) {
            res.status(400).send({
                message: error.message
            })
        }
    },
    getComment: async (req, res) => {
        try {

        } catch (error) {
            
        }
    }
}
export default systemController;