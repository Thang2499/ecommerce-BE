import axios from 'axios';
import crypto from 'crypto'
const paymentMethod = {
    paymentMethod: async (req, res) => {
        const { amountPayment } = req.body; 
        if (!amountPayment || isNaN(amountPayment)) {
            return res.status(400).json({ message: 'Total is required and should be a number' });
        }
        var accessKey = 'F8BBA842ECF85';
        var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        var orderInfo = 'pay with MoMo';
        var partnerCode = 'MOMO';
        var redirectUrl = 'http://localhost:5173/';
        var ipnUrl = 'http://localhost:5173/';
        var requestType = "payWithMethod";
        var amount = Number(amountPayment);
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;
        var extraData = '';
        var orderGroupId = '';
        var autoCapture = true;
        var lang = 'vi';
        console.log("Raw Signature:", amount);
        //before sign HMAC SHA256 with format
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
      
        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        // console.log("--------------------SIGNATURE----------------")
        // console.log(signature)
    
        //json object send to MoMo endpoint
        const requestBody = {
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        };
        const options = {
            method: "POST",
            url: "https://test-payment.momo.vn/v2/gateway/api/create",
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody
        };
        
        let result;
        try {
            result = await axios(options);
            return res.json(result.data);
        } catch (error) {
            console.error("Error occurred: ", error);
            return res.status(500).json({
                statusCode: 500,
                message: "Server lỗi",
                error: error.response ? error.response.data : error.message
            });
        }
    }
}
export default paymentMethod;