"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const WarehouseSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model('Warehouse', WarehouseSchema);
