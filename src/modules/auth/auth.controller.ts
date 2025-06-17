import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../../models/admin.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class AuthController {
    // Login admin
    static async login(req: Request, res: Response): Promise<void> {
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
            const admin = await Admin.findOne({
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
            const isPasswordValid = await admin.comparePassword(password);
            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
                return;
            }

            // Update last login
            admin.lastLogin = new Date();
            await admin.save();

            // Generate JWT token
            const token = jwt.sign(
                {
                    adminId: admin._id,
                    username: admin.username,
                    role: admin.role
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
            );

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

        } catch (error: any) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    // Logout admin
    static async logout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie('adminToken');
            res.status(200).json({
                success: true,
                message: 'Logout successful'
            });
        } catch (error: any) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    // Verify token and get admin info
    static async verifyToken(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies.adminToken || req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'No token provided'
                });
                return;
            }

            const decoded: any = jwt.verify(token, JWT_SECRET);
            const admin = await Admin.findById(decoded.adminId);

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

        } catch (error: any) {
            console.error('Token verification error:', error);
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    }

    // Create initial admin (for setup)
    static async createInitialAdmin(req: Request, res: Response): Promise<void> {
        try {
            // Check if any admin exists
            const existingAdmin = await Admin.findOne();
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
            const admin = new Admin({
                username: username.toLowerCase(),
                password,
                email: email.toLowerCase(),
                role: 'super_admin'
            });

            await admin.save();

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

        } catch (error: any) {
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
    }

    // Change password
    static async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const { currentPassword, newPassword } = req.body;
            const adminId = (req as any).admin.adminId;

            if (!currentPassword || !newPassword) {
                res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required'
                });
                return;
            }

            const admin = await Admin.findById(adminId).select('+password');
            if (!admin) {
                res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
                return;
            }

            // Verify current password
            const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
                return;
            }

            // Update password
            admin.password = newPassword;
            await admin.save();

            res.status(200).json({
                success: true,
                message: 'Password changed successfully'
            });

        } catch (error: any) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
} 