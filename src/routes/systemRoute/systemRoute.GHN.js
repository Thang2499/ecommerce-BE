import express from 'express';
import GHNController from '../../controllers/systemController/systemController.GHN.js';
import paymentMethod from '../../controllers/systemController/systemController.PaymentMethod.js';

const manageGHN = express.Router();

manageGHN.post('/payment',paymentMethod.paymentMethod);

manageGHN.get('/provinces',GHNController.getProvinces);
manageGHN.get('/districts/:province_id',GHNController.getDistricts);
manageGHN.get('/wards/:district_id',GHNController.getWards);
manageGHN.post('/shippingFee',GHNController.shippingFee);
export default manageGHN;