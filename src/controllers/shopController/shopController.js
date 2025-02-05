import orderModel from "../../models/orderModel.js";
import productModel from "../../models/productModel.js";
import shopModel from "../../models/shopModel.js";
import cloudinaryService from "../../services/cloudinary.service.js";
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
     getProductList :async (req, res) => {
        const { id } = req.body;  // Lấy id từ body
        const { page = 1, limit = 20 } = req.query;  // Lấy page và limit từ query params
    
        const startPo = (page - 1) * limit;  // Vị trí bắt đầu cho page
        const endPo = startPo + limit;       // Vị trí kết thúc cho page
    
        try {
            // Lấy tổng số sản phẩm trong shop
            const totalProducts = await productModel.countDocuments({ shopId: id });
    
            // Tính tổng số trang
            const totalPages = Math.ceil(totalProducts / limit);
    
            // Lấy danh sách sản phẩm cho trang hiện tại
            const productList = await productModel
                .find({ shopId: id })
                .skip(startPo)
                .limit(limit);
    
            if (productList.length > 0) {
                // Trả về danh sách sản phẩm, số trang, tổng số sản phẩm, limit và page hiện tại
                res.status(200).send({
                    productList,
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    limit
                });
            } else {
                res.status(404).send({ message: "No products found for this shop." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error while getting product list" });
        }
    },
    createProduct: async (req, res) => {
        const { name, price, description, category,shopId } = req.body;
        const { image, imageDetail } = req.files;
        try {
            if (!image || !image[0].buffer) {
                return res.status(400).json({ message: 'Please upload the main image.' });
            }
            const mainImagePath = image[0];
            const uploadedMainImage = await cloudinaryService.postSingleImage(mainImagePath, 'products');
            const mainImageUrl = uploadedMainImage.secure_url;
            
            const detailImageUrls = [];
            if (imageDetail) {
                const uploadedDetailImage = await cloudinaryService.postMultipleImages(imageDetail, 'products');
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
    },
    updateProduct: async (req, res) => {
        const { name, price, description, category,shopId } = req.body;
        const {id} = req.params;
        const { image, imageDetail } = req.files;
        try {
            let mainImageUrl = undefined;
            if (image && image[0] && image[0].buffer) {
                const mainImagePath = image[0];
                const uploadedMainImage = await cloudinaryService.postSingleImage(mainImagePath, 'products');
                mainImageUrl = uploadedMainImage.secure_url; // Lưu URL của ảnh mới
            }
            
            const detailImageUrls = [];
            if (imageDetail) {
                const uploadedDetailImage = await cloudinaryService.postMultipleImages(imageDetail, 'products');
                uploadedDetailImage.forEach(img => detailImageUrls.push(img.secure_url));
            }
            const oldProduct = await productModel.findById(id);
           
            if(oldProduct.shopId.toString() !== shopId){
                return res.status(403).send({message: "You are not allowed to update this product"});
            }
            if(!oldProduct){
                return res.status(404).send({message: "Product not found"});
            }
            const newProduct = await productModel.findByIdAndUpdate(id,{
                productName:name || oldProduct.productName,
                price: price || oldProduct.price,
                description: description || oldProduct.description,
                category: category || oldProduct.category,
                shopId: shopId,
                image: mainImageUrl || oldProduct.image,
                imageDetail: detailImageUrls || oldProduct.imageDetail    
            });

            await newProduct.save();
            res.status(201).send(newProduct);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        const {id} = req.params;
        const {shopId} = req.query;
        console.log(id,shopId);
        try {
            const product = await productModel.findById(id);
            if(product.shopId.toString() !== shopId){
                return res.status(403).send({message: "You are not allowed to delete this product"});
            }
            if(!product){
                return res.status(404).send({message: "Product not found"});
            }
            await productModel.findByIdAndDelete(id);
            res.status(200).send({message: "Product deleted successfully"});
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    manageOrder: async (req,res) => {
        try {
            const user = req.user;
            const findShop = await orderModel.find({shopId:user.shopId}).populate({
                path:'items.itemId',
                model:'items',
                populate: {
                    path: 'productId',
                    model: 'products',
                    select: 'productName image'
                  },
            }).populate({
                path:'userId',
                model:'users',
                select:'name phone'
            });
            res.send(findShop)
        } catch (error) {
            res.status(400).send({
                message: error.message
            })
        }
    },
    approveOrder: async (req,res) =>{
        try {
            const {newStatus} = req.body;
            const orderId = req.params;
            const updateStatus = await orderModel.findByIdAndUpdate(orderId.orderId,{
                status:newStatus
            })
            res.status(200).send('success')
        } catch (error) {
            return res.status(400).send(error.message)
        }
    },
      
}
export default shopController;