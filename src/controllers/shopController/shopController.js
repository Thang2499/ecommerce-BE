import productModel from "../../models/productModel.js";
import shopModel from "../../models/shopModel.js";
import cloudinaryService from "../../services/cloudinary.service.js";
import fs from 'fs';
const shopController = {
    getShopProfile: async (req, res) =>{
        const {id} = req.body;
        try {
        const shopProfile = await shopModel.findById(id);
        if(shopProfile){
            res.status(200).send(shopProfile);
        }else{
            res.status(404).send({message: "Shop not found"});
        }
        } catch (error) {
            res.status(500).send({message: "Error while getting shop profile"})
        }
    },
    getProductList: async (req, res) =>{
        const {id} = req.body;
        try {
        const productList = await productModel.find(id);
        if(productList){
            res.status(200).send(productList);
        }else{
            res.status(404).send({message: "Product list not found"});
        }
        } catch (error) {
            res.status(500).send({message: "Error while getting shop profile"})
        }
    },
    createProduct: async (req, res) => {
        const { name, price, description, category,shopId } = req.body;
        const { image, imageDetail } = req.files;
        try {
            if (!image) {
                return res.status(400).json({ message: 'Please upload the main image.' });
            }
            // Upload main image to Cloudinary
            const mainImagePath = image[0].path;
            const uploadedMainImage = await cloudinaryService.postSingleImage(mainImagePath, 'products');
            const mainImageUrl = uploadedMainImage.secure_url;
            
            // Upload detail images to Cloudinary
            const detailImageUrls = [];
            if (imageDetail) {
                const uploadedDetailImage = await cloudinaryService.postMultipleImages(imageDetail, 'products');
                // Lưu trữ URL của ảnh chi tiết
                uploadedDetailImage.forEach(img => detailImageUrls.push(img.secure_url));
            }
            const newProduct = new productModel({
                productName:name,
                price: price,
                description: description,
                category: category,
                shopId: shopId,
                image: mainImageUrl,
                imageDetail: detailImageUrls 
            });

            await newProduct.save();
            res.status(201).send(newProduct);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
      
}
export default shopController;