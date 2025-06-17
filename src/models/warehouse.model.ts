import mongoose, { Schema, Document } from 'mongoose';

export interface IWarehouse extends Document {
    name: string;
    location: {
        latitude: number;
        longitude: number;
    };
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    contact: {
        phone: string;
        email: string;
        website?: string;
    };
    operatingHours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    services: string[];
    description: string;
    image?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const WarehouseSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },
        longitude: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        }
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true, default: 'USA' }
    },
    contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
        website: { type: String }
    },
    operatingHours: {
        monday: { type: String, default: '9:00 AM - 5:00 PM' },
        tuesday: { type: String, default: '9:00 AM - 5:00 PM' },
        wednesday: { type: String, default: '9:00 AM - 5:00 PM' },
        thursday: { type: String, default: '9:00 AM - 5:00 PM' },
        friday: { type: String, default: '9:00 AM - 5:00 PM' },
        saturday: { type: String, default: 'Closed' },
        sunday: { type: String, default: 'Closed' }
    },
    services: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Add indexes for geospatial queries
WarehouseSchema.index({ "location.latitude": 1, "location.longitude": 1 });

export default mongoose.model<IWarehouse>('Warehouse', WarehouseSchema); 