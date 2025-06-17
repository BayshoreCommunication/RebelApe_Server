"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoURI = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/warehouse_locator';
        yield mongoose_1.default.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
});
// Handle MongoDB connection events
mongoose_1.default.connection.on('connected', () => {
    console.log('✅ Mongoose connected to MongoDB');
});
mongoose_1.default.connection.on('error', (error) => {
    console.error('❌ Mongoose connection error:', error);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('🔶 Mongoose disconnected from MongoDB');
});
// Graceful shutdown
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connection.close();
        console.log('✅ MongoDB connection closed through app termination');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
        process.exit(1);
    }
}));
exports.default = connectDB;
