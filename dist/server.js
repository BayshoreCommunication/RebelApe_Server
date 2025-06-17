"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
// For Vercel deployment
exports.default = app_1.default;
// For local development
if (process.env.NODE_ENV !== 'production') {
    app_1.default.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
}
