"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseRoute = void 0;
const express_1 = require("express");
const warehouse_controller_1 = require("./warehouse.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
// GET /api/warehouses - Get all active warehouses
router.get('/warehouses', warehouse_controller_1.WarehouseController.getAllWarehouses);
// GET /api/warehouses/nearby - Get nearby warehouses
router.get('/warehouses/nearby', warehouse_controller_1.WarehouseController.getNearbyWarehouses);
// GET /api/warehouse/:id - Get warehouse by ID
router.get('/warehouse/:id', warehouse_controller_1.WarehouseController.getWarehouseById);
// Admin routes (protected)
// GET /api/warehouses/admin/all - Get all warehouses (including inactive)
router.get('/warehouses/admin/all', auth_middleware_1.authenticateAdmin, warehouse_controller_1.WarehouseController.getAllWarehousesAdmin);
// POST /api/warehouses - Create new warehouse
router.post('/warehouses', auth_middleware_1.authenticateAdmin, warehouse_controller_1.WarehouseController.createWarehouse);
// PUT /api/warehouses/:id - Update warehouse
router.put('/warehouses/:id', auth_middleware_1.authenticateAdmin, warehouse_controller_1.WarehouseController.updateWarehouse);
// DELETE /api/warehouses/:id - Delete warehouse (soft delete)
router.delete('/warehouses/:id', auth_middleware_1.authenticateAdmin, warehouse_controller_1.WarehouseController.deleteWarehouse);
// PATCH /api/warehouses/:id/toggle-status - Toggle warehouse active/inactive status
router.patch('/warehouses/:id/toggle-status', auth_middleware_1.authenticateAdmin, warehouse_controller_1.WarehouseController.toggleWarehouseStatus);
// DELETE /api/warehouses/:id/permanent - Permanently delete warehouse
router.delete('/warehouses/:id/permanent', auth_middleware_1.authenticateAdmin, warehouse_controller_1.WarehouseController.permanentDeleteWarehouse);
exports.WarehouseRoute = router;
