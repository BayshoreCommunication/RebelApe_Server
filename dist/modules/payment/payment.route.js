"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const test_controller_1 = require("./test.controller");
const router = express_1.default.Router();
router.post('/create-checkout-session', payment_controller_1.PaymentController.initiateStripePayment);
router.post('/send-single-product-email', payment_controller_1.PaymentController.sendSingleProductEmail);
router.post('/send-multiple-products-email', payment_controller_1.PaymentController.sendMultipleProductsEmail);
router.post('/ai', test_controller_1.TestController.openAi);
exports.PaymentRoute = router;
