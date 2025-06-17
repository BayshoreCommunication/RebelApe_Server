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
exports.WarehouseController = void 0;
const warehouse_model_1 = __importDefault(require("../../models/warehouse.model"));
class WarehouseController {
    // GET /api/warehouses - Get all warehouses
    static getAllWarehouses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouses = yield warehouse_model_1.default.find({ isActive: true }).sort({ createdAt: -1 });
                res.status(200).json({
                    success: true,
                    message: 'Warehouses fetched successfully',
                    data: warehouses
                });
            }
            catch (error) {
                console.error('Error fetching warehouses:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch warehouses',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // GET /api/warehouse/:id - Get warehouse by ID
    static getWarehouseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const warehouse = yield warehouse_model_1.default.findById(id);
                if (!warehouse) {
                    res.status(404).json({
                        success: false,
                        message: 'Warehouse not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Warehouse fetched successfully',
                    data: warehouse
                });
            }
            catch (error) {
                console.error('Error fetching warehouse:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch warehouse',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // POST /api/warehouses - Create new warehouse (for testing/admin)
    static createWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouseData = req.body;
                // Create new warehouse
                const warehouse = new warehouse_model_1.default(warehouseData);
                yield warehouse.save();
                res.status(201).json({
                    success: true,
                    message: 'Warehouse created successfully',
                    data: warehouse
                });
            }
            catch (error) {
                console.error('Error creating warehouse:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to create warehouse',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // PUT /api/warehouses/:id - Update warehouse
    static updateWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updateData = req.body;
                const warehouse = yield warehouse_model_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true });
                if (!warehouse) {
                    res.status(404).json({
                        success: false,
                        message: 'Warehouse not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Warehouse updated successfully',
                    data: warehouse
                });
            }
            catch (error) {
                console.error('Error updating warehouse:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to update warehouse',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // DELETE /api/warehouses/:id - Delete warehouse (soft delete by setting isActive to false)
    static deleteWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const warehouse = yield warehouse_model_1.default.findByIdAndUpdate(id, { isActive: false, updatedAt: new Date() }, { new: true });
                if (!warehouse) {
                    res.status(404).json({
                        success: false,
                        message: 'Warehouse not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Warehouse deleted successfully',
                    data: warehouse
                });
            }
            catch (error) {
                console.error('Error deleting warehouse:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete warehouse',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // GET /api/warehouses/nearby - Get warehouses within a radius
    static getNearbyWarehouses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lat, lng, radius = 50 } = req.query;
                if (!lat || !lng) {
                    res.status(400).json({
                        success: false,
                        message: 'Latitude and longitude are required'
                    });
                    return;
                }
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lng);
                const maxDistance = parseFloat(radius) * 1609.34; // Convert miles to meters
                const warehouses = yield warehouse_model_1.default.find({
                    isActive: true,
                    location: {
                        $near: {
                            $geometry: {
                                type: 'Point',
                                coordinates: [longitude, latitude]
                            },
                            $maxDistance: maxDistance
                        }
                    }
                });
                res.status(200).json({
                    success: true,
                    message: 'Nearby warehouses fetched successfully',
                    data: warehouses
                });
            }
            catch (error) {
                console.error('Error fetching nearby warehouses:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch nearby warehouses',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Get all warehouses for admin (including inactive ones)
    static getAllWarehousesAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouses = yield warehouse_model_1.default.find().sort({ createdAt: -1 });
                res.status(200).json({
                    success: true,
                    message: 'All warehouses fetched successfully',
                    data: warehouses
                });
            }
            catch (error) {
                console.error('Error fetching warehouses:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch warehouses',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // PATCH /api/warehouses/:id/toggle-status - Toggle warehouse active/inactive status
    static toggleWarehouseStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const warehouse = yield warehouse_model_1.default.findById(id);
                if (!warehouse) {
                    res.status(404).json({
                        success: false,
                        message: 'Warehouse not found'
                    });
                    return;
                }
                // Toggle the status
                warehouse.isActive = !warehouse.isActive;
                warehouse.updatedAt = new Date();
                yield warehouse.save();
                res.status(200).json({
                    success: true,
                    message: `Warehouse ${warehouse.isActive ? 'activated' : 'deactivated'} successfully`,
                    data: warehouse
                });
            }
            catch (error) {
                console.error('Error toggling warehouse status:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to toggle warehouse status',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // DELETE /api/warehouses/:id/permanent - Permanently delete warehouse
    static permanentDeleteWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const warehouse = yield warehouse_model_1.default.findByIdAndDelete(id);
                if (!warehouse) {
                    res.status(404).json({
                        success: false,
                        message: 'Warehouse not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Warehouse permanently deleted successfully',
                    data: warehouse
                });
            }
            catch (error) {
                console.error('Error permanently deleting warehouse:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to permanently delete warehouse',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
}
exports.WarehouseController = WarehouseController;
