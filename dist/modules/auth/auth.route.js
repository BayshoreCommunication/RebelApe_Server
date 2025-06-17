"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
exports.AuthRoute = router;
// Public routes
router.post('/auth/login', auth_controller_1.AuthController.login);
router.post('/auth/setup', auth_controller_1.AuthController.createInitialAdmin);
// Protected routes
router.post('/auth/logout', auth_middleware_1.authenticateAdmin, auth_controller_1.AuthController.logout);
router.get('/auth/verify', auth_controller_1.AuthController.verifyToken);
router.post('/auth/change-password', auth_middleware_1.authenticateAdmin, auth_controller_1.AuthController.changePassword);
