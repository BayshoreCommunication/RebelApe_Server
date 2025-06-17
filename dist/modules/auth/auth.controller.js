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
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_model_1 = require("../../models/admin.model");
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
class AuthController {
    // Login admin
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                // Validate input
                if (!username || !password) {
                    res.status(400).json({
                        success: false,
                        message: 'Username and password are required'
                    });
                    return;
                }
                // Find admin by username
                const admin = yield admin_model_1.Admin.findOne({
                    username: username.toLowerCase(),
                    isActive: true
                }).select('+password');
                if (!admin) {
                    res.status(401).json({
                        success: false,
                        message: 'Invalid credentials'
                    });
                    return;
                }
                // Check password
                const isPasswordValid = yield admin.comparePassword(password);
                if (!isPasswordValid) {
                    res.status(401).json({
                        success: false,
                        message: 'Invalid credentials'
                    });
                    return;
                }
                // Update last login
                admin.lastLogin = new Date();
                yield admin.save();
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({
                    adminId: admin._id,
                    username: admin.username,
                    role: admin.role
                }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
                // Set token as httpOnly cookie
                res.cookie('adminToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000 // 24 hours
                });
                res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    admin: {
                        id: admin._id,
                        username: admin.username,
                        email: admin.email,
                        role: admin.role,
                        lastLogin: admin.lastLogin
                    },
                    token
                });
            }
            catch (error) {
                console.error('Login error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
    // Logout admin
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('adminToken');
                res.status(200).json({
                    success: true,
                    message: 'Logout successful'
                });
            }
            catch (error) {
                console.error('Logout error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
    // Verify token and get admin info
    static verifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = req.cookies.adminToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
                if (!token) {
                    res.status(401).json({
                        success: false,
                        message: 'No token provided'
                    });
                    return;
                }
                const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                const admin = yield admin_model_1.Admin.findById(decoded.adminId);
                if (!admin || !admin.isActive) {
                    res.status(401).json({
                        success: false,
                        message: 'Invalid token or admin not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    admin: {
                        id: admin._id,
                        username: admin.username,
                        email: admin.email,
                        role: admin.role,
                        lastLogin: admin.lastLogin
                    }
                });
            }
            catch (error) {
                console.error('Token verification error:', error);
                res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }
        });
    }
    // Create initial admin (for setup)
    static createInitialAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if any admin exists
                const existingAdmin = yield admin_model_1.Admin.findOne();
                if (existingAdmin) {
                    res.status(400).json({
                        success: false,
                        message: 'Admin already exists'
                    });
                    return;
                }
                const { username, password, email } = req.body;
                // Validate input
                if (!username || !password || !email) {
                    res.status(400).json({
                        success: false,
                        message: 'Username, password, and email are required'
                    });
                    return;
                }
                // Create admin
                const admin = new admin_model_1.Admin({
                    username: username.toLowerCase(),
                    password,
                    email: email.toLowerCase(),
                    role: 'super_admin'
                });
                yield admin.save();
                res.status(201).json({
                    success: true,
                    message: 'Initial admin created successfully',
                    admin: {
                        id: admin._id,
                        username: admin.username,
                        email: admin.email,
                        role: admin.role
                    }
                });
            }
            catch (error) {
                console.error('Create admin error:', error);
                if (error.code === 11000) {
                    res.status(400).json({
                        success: false,
                        message: 'Username or email already exists'
                    });
                    return;
                }
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
    // Change password
    static changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { currentPassword, newPassword } = req.body;
                const adminId = req.admin.adminId;
                if (!currentPassword || !newPassword) {
                    res.status(400).json({
                        success: false,
                        message: 'Current password and new password are required'
                    });
                    return;
                }
                const admin = yield admin_model_1.Admin.findById(adminId).select('+password');
                if (!admin) {
                    res.status(404).json({
                        success: false,
                        message: 'Admin not found'
                    });
                    return;
                }
                // Verify current password
                const isCurrentPasswordValid = yield admin.comparePassword(currentPassword);
                if (!isCurrentPasswordValid) {
                    res.status(400).json({
                        success: false,
                        message: 'Current password is incorrect'
                    });
                    return;
                }
                // Update password
                admin.password = newPassword;
                yield admin.save();
                res.status(200).json({
                    success: true,
                    message: 'Password changed successfully'
                });
            }
            catch (error) {
                console.error('Change password error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
}
exports.AuthController = AuthController;
