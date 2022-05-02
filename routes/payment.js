import express from "express"; 
import { makeOrderMethod, verifyPaymentMethod } from "../controllers/paymentcontrols.js";


const router = express.Router(); 

//order rourtes for payment
router.post("/payment/orders", makeOrderMethod ); 
//verification routes for paymennt
router.post("/payment/verify", verifyPaymentMethod); 


export const paymentRouter = router; 