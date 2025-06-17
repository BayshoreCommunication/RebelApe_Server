import { Request, Response } from 'express';
import Warehouse, { IWarehouse } from '../../models/warehouse.model';

export class WarehouseController {
    // GET /api/warehouses - Get all warehouses
    static async getAllWarehouses(req: Request, res: Response): Promise<void> {
        try {
            const warehouses = await Warehouse.find({ isActive: true }).sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                message: 'Warehouses fetched successfully',
                data: warehouses
            });
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch warehouses',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // GET /api/warehouse/:id - Get warehouse by ID
    static async getWarehouseById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const warehouse = await Warehouse.findById(id);

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
        } catch (error) {
            console.error('Error fetching warehouse:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch warehouse',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // POST /api/warehouses - Create new warehouse (for testing/admin)
    static async createWarehouse(req: Request, res: Response): Promise<void> {
        try {
            const warehouseData = req.body;

            // Create new warehouse
            const warehouse = new Warehouse(warehouseData);
            await warehouse.save();

            res.status(201).json({
                success: true,
                message: 'Warehouse created successfully',
                data: warehouse
            });
        } catch (error) {
            console.error('Error creating warehouse:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create warehouse',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // PUT /api/warehouses/:id - Update warehouse
    static async updateWarehouse(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const warehouse = await Warehouse.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

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
        } catch (error) {
            console.error('Error updating warehouse:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update warehouse',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // DELETE /api/warehouses/:id - Delete warehouse (soft delete by setting isActive to false)
    static async deleteWarehouse(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const warehouse = await Warehouse.findByIdAndUpdate(
                id,
                { isActive: false, updatedAt: new Date() },
                { new: true }
            );

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
        } catch (error) {
            console.error('Error deleting warehouse:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete warehouse',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // GET /api/warehouses/nearby - Get warehouses within a radius
    static async getNearbyWarehouses(req: Request, res: Response): Promise<void> {
        try {
            const { lat, lng, radius = 50 } = req.query;

            if (!lat || !lng) {
                res.status(400).json({
                    success: false,
                    message: 'Latitude and longitude are required'
                });
                return;
            }

            const latitude = parseFloat(lat as string);
            const longitude = parseFloat(lng as string);
            const maxDistance = parseFloat(radius as string) * 1609.34; // Convert miles to meters

            const warehouses = await Warehouse.find({
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
        } catch (error) {
            console.error('Error fetching nearby warehouses:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch nearby warehouses',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // Get all warehouses for admin (including inactive ones)
    static async getAllWarehousesAdmin(req: Request, res: Response): Promise<void> {
        try {
            const warehouses = await Warehouse.find().sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                message: 'All warehouses fetched successfully',
                data: warehouses
            });
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch warehouses',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // PATCH /api/warehouses/:id/toggle-status - Toggle warehouse active/inactive status
    static async toggleWarehouseStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const warehouse = await Warehouse.findById(id);
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
            await warehouse.save();

            res.status(200).json({
                success: true,
                message: `Warehouse ${warehouse.isActive ? 'activated' : 'deactivated'} successfully`,
                data: warehouse
            });
        } catch (error) {
            console.error('Error toggling warehouse status:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to toggle warehouse status',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // DELETE /api/warehouses/:id/permanent - Permanently delete warehouse
    static async permanentDeleteWarehouse(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const warehouse = await Warehouse.findByIdAndDelete(id);

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
        } catch (error) {
            console.error('Error permanently deleting warehouse:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to permanently delete warehouse',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
} 