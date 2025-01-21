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
        const { id } = req.body;

        try {
            const user = await userModel.findById(id);
            if(user.cart){
                res.status(200).send(user.cart);
            }else{
                res.status(404).send({message: "Cart not found"});
            }
        } catch (error) {
            res.status(500).send({message: "Error while getting cart"})
        }
    },
    getWistList : async (req, res) => {
        const { id } = req.body;

        try {
            const user = await userModel.findById(id);
            if(user.wishlist){
                res.status(200).send(user.wishlist);
            }else{
                res.status(404).send({message: "Cart not found"});
            }
        } catch (error) {
            res.status(500).send({message: "Error while getting cart"})
        }
    },
}
export default systemController;