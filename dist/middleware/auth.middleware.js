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
exports.requireSuperAdmin = exports.authenticateAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_model_1 = require("../models/admin.model");
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const authenticateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.adminToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const admin = yield admin_model_1.Admin.findById(decoded.adminId);
        if (!admin || !admin.isActive) {
            res.status(401).json({
                success: false,
                message: 'Access denied. Invalid token or admin not found.'
            });
            return;
        }
        req.admin = decoded;
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Access denied. Invalid token.'
        });
    }
});
exports.authenticateAdmin = authenticateAdmin;
const requireSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.admin) {
            res.status(401).json({
                success: false,
                message: 'Access denied. Authentication required.'
            });
            return;
        }
        if (req.admin.role !== 'super_admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Super admin privileges required.'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Super admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});
exports.requireSuperAdmin = requireSuperAdmin;
