import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/auth/login', AuthController.login);
router.post('/auth/setup', AuthController.createInitialAdmin);

// Protected routes
router.post('/auth/logout', authenticateAdmin, AuthController.logout);
router.get('/auth/verify', AuthController.verifyToken);
router.post('/auth/change-password', authenticateAdmin, AuthController.changePassword);

export { router as AuthRoute }; 