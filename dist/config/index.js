"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), ".env")) });
exports.default = {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    owner_email: process.env.OWNER_EMAIL,
    stripe_navigate_url: process.env.STRIPE_NAVIGATE_URL,
};
