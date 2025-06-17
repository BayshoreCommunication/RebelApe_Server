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
exports.seedWarehouses = void 0;
const database_1 = __importDefault(require("../config/database"));
const warehouse_model_1 = __importDefault(require("../models/warehouse.model"));
const sampleWarehouses = [
    {
        name: "Central Distribution Hub",
        location: {
            latitude: 40.7128,
            longitude: -74.0060
        },
        address: {
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA"
        },
        contact: {
            phone: "+1 (555) 123-4567",
            email: "central@warehouse.com",
            website: "https://central-warehouse.com"
        },
        operatingHours: {
            monday: "8:00 AM - 6:00 PM",
            tuesday: "8:00 AM - 6:00 PM",
            wednesday: "8:00 AM - 6:00 PM",
            thursday: "8:00 AM - 6:00 PM",
            friday: "8:00 AM - 6:00 PM",
            saturday: "9:00 AM - 4:00 PM",
            sunday: "Closed"
        },
        services: ["Storage", "Distribution", "Packaging", "Cross-docking"],
        description: "Our largest distribution hub serving the East Coast with state-of-the-art facilities and 24/7 security monitoring.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop"
    },
    {
        name: "West Coast Logistics Center",
        location: {
            latitude: 34.0522,
            longitude: -118.2437
        },
        address: {
            street: "456 Industrial Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90001",
            country: "USA"
        },
        contact: {
            phone: "+1 (555) 987-6543",
            email: "westcoast@warehouse.com",
            website: "https://westcoast-warehouse.com"
        },
        operatingHours: {
            monday: "7:00 AM - 7:00 PM",
            tuesday: "7:00 AM - 7:00 PM",
            wednesday: "7:00 AM - 7:00 PM",
            thursday: "7:00 AM - 7:00 PM",
            friday: "7:00 AM - 7:00 PM",
            saturday: "8:00 AM - 5:00 PM",
            sunday: "Closed"
        },
        services: ["Storage", "Distribution", "Fulfillment", "Inventory Management"],
        description: "Modern facility with automated sorting systems and same-day delivery capabilities for the West Coast region.",
        image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=800&h=600&fit=crop"
    },
    {
        name: "Midwest Processing Facility",
        location: {
            latitude: 41.8781,
            longitude: -87.6298
        },
        address: {
            street: "789 Commerce Blvd",
            city: "Chicago",
            state: "IL",
            zipCode: "60601",
            country: "USA"
        },
        contact: {
            phone: "+1 (555) 555-0123",
            email: "midwest@warehouse.com",
            website: "https://midwest-warehouse.com"
        },
        operatingHours: {
            monday: "6:00 AM - 8:00 PM",
            tuesday: "6:00 AM - 8:00 PM",
            wednesday: "6:00 AM - 8:00 PM",
            thursday: "6:00 AM - 8:00 PM",
            friday: "6:00 AM - 8:00 PM",
            saturday: "7:00 AM - 6:00 PM",
            sunday: "9:00 AM - 3:00 PM"
        },
        services: ["Cold Storage", "Processing", "Distribution", "Quality Control"],
        description: "Specialized facility for temperature-sensitive goods with advanced cold storage capabilities and quality assurance.",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop"
    },
    {
        name: "Southeast Distribution Point",
        location: {
            latitude: 25.7617,
            longitude: -80.1918
        },
        address: {
            street: "321 Logistics Way",
            city: "Miami",
            state: "FL",
            zipCode: "33101",
            country: "USA"
        },
        contact: {
            phone: "+1 (555) 444-7890",
            email: "southeast@warehouse.com",
            website: "https://southeast-warehouse.com"
        },
        operatingHours: {
            monday: "8:00 AM - 6:00 PM",
            tuesday: "8:00 AM - 6:00 PM",
            wednesday: "8:00 AM - 6:00 PM",
            thursday: "8:00 AM - 6:00 PM",
            friday: "8:00 AM - 6:00 PM",
            saturday: "9:00 AM - 4:00 PM",
            sunday: "Closed"
        },
        services: ["Import/Export", "Customs Clearance", "Storage", "International Shipping"],
        description: "Strategic location for international trade with direct port access and customs clearance capabilities.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
    },
    {
        name: "Northwest Storage Solutions",
        location: {
            latitude: 47.6062,
            longitude: -122.3321
        },
        address: {
            street: "654 Pacific Rim Dr",
            city: "Seattle",
            state: "WA",
            zipCode: "98101",
            country: "USA"
        },
        contact: {
            phone: "+1 (555) 333-2468",
            email: "northwest@warehouse.com",
            website: "https://northwest-warehouse.com"
        },
        operatingHours: {
            monday: "7:00 AM - 7:00 PM",
            tuesday: "7:00 AM - 7:00 PM",
            wednesday: "7:00 AM - 7:00 PM",
            thursday: "7:00 AM - 7:00 PM",
            friday: "7:00 AM - 7:00 PM",
            saturday: "8:00 AM - 5:00 PM",
            sunday: "10:00 AM - 4:00 PM"
        },
        services: ["Storage", "Distribution", "E-commerce Fulfillment", "Returns Processing"],
        description: "Eco-friendly facility powered by renewable energy, specializing in e-commerce fulfillment and sustainable practices.",
        image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&h=600&fit=crop"
    }
];
const seedWarehouses = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.default)();
        // Clear existing warehouses
        yield warehouse_model_1.default.deleteMany({});
        console.log('🧹 Cleared existing warehouse data');
        // Insert sample warehouses
        const insertedWarehouses = yield warehouse_model_1.default.insertMany(sampleWarehouses);
        console.log(`✅ Successfully seeded ${insertedWarehouses.length} warehouses`);
        console.log('Seeded warehouses:');
        insertedWarehouses.forEach((warehouse, index) => {
            console.log(`${index + 1}. ${warehouse.name} - ${warehouse.address.city}, ${warehouse.address.state}`);
        });
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding warehouses:', error);
        process.exit(1);
    }
});
exports.seedWarehouses = seedWarehouses;
// Run seed function if this file is executed directly
if (require.main === module) {
    (0, exports.seedWarehouses)();
}
