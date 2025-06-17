import express from "express";
import { PaymentController } from "./payment.controller";
import { TestController } from "./test.controller";
const router = express.Router();

router.post('/create-checkout-session', PaymentController.initiateStripePayment);
router.post('/send-single-product-email', PaymentController.sendSingleProductEmail);
router.post('/send-multiple-products-email', PaymentController.sendMultipleProductsEmail);
router.post('/ai', TestController.openAi);

export const PaymentRoute = router;