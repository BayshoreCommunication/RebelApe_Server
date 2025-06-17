import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

interface AuthenticatedRequest extends Request {
    admin?: any;
}

export const authenticateAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.adminToken || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findById(decoded.adminId);

        if (!admin || !admin.isActive) {
            res.status(401).json({
                success: false,
                message: 'Access denied. Invalid token or admin not found.'
            });
            return;
        }

        req.admin = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Access denied. Invalid token.'
        });
    }
};

export const requireSuperAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
    } catch (error) {
        console.error('Super admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}; 