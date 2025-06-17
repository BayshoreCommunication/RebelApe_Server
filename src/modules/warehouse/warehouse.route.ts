import { Router } from 'express';
import { WarehouseController } from './warehouse.controller';
import { authenticateAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
// GET /api/warehouses - Get all active warehouses
router.get('/warehouses', WarehouseController.getAllWarehouses);

// GET /api/warehouses/nearby - Get nearby warehouses
router.get('/warehouses/nearby', WarehouseController.getNearbyWarehouses);

// GET /api/warehouse/:id - Get warehouse by ID
router.get('/warehouse/:id', WarehouseController.getWarehouseById);

// Admin routes (protected)
// GET /api/warehouses/admin/all - Get all warehouses (including inactive)
router.get('/warehouses/admin/all', authenticateAdmin, WarehouseController.getAllWarehousesAdmin);

// POST /api/warehouses - Create new warehouse
router.post('/warehouses', authenticateAdmin, WarehouseController.createWarehouse);

// PUT /api/warehouses/:id - Update warehouse
router.put('/warehouses/:id', authenticateAdmin, WarehouseController.updateWarehouse);

// DELETE /api/warehouses/:id - Delete warehouse (soft delete)
router.delete('/warehouses/:id', authenticateAdmin, WarehouseController.deleteWarehouse);

// PATCH /api/warehouses/:id/toggle-status - Toggle warehouse active/inactive status
router.patch('/warehouses/:id/toggle-status', authenticateAdmin, WarehouseController.toggleWarehouseStatus);

// DELETE /api/warehouses/:id/permanent - Permanently delete warehouse
router.delete('/warehouses/:id/permanent', authenticateAdmin, WarehouseController.permanentDeleteWarehouse);

export const WarehouseRoute = router; 