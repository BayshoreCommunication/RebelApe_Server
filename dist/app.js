"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const os_1 = __importDefault(require("os"));
const database_1 = __importDefault(require("./config/database"));
const payment_route_1 = require("./modules/payment/payment.route");
const warehouse_route_1 = require("./modules/warehouse/warehouse.route");
const auth_route_1 = require("./modules/auth/auth.route");
const app = (0, express_1.default)();
// Connect to MongoDB
(0, database_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://your-domain.com'],
    credentials: true
}));
//applications route
app.use("/api", payment_route_1.PaymentRoute);
app.use("/api", warehouse_route_1.WarehouseRoute);
app.use("/api", auth_route_1.AuthRoute);
app.get("/", (req, res) => {
    res.send("Warehouse Locator API - Server is running!");
});
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString()
    });
});
// Route to fetch MAC address
app.get('/getMacAddress', (req, res) => {
    try {
        const networkInterfaces = os_1.default.networkInterfaces();
        const macAddresses = [];
        Object.values(networkInterfaces).forEach((iface) => {
            iface === null || iface === void 0 ? void 0 : iface.forEach((config) => {
                if (config.mac !== '00:00:00:00:00:00') {
                    macAddresses.push(config.mac);
                }
            });
        });
        res.status(200).json({ macAddress: macAddresses[0] || 'Unavailable' });
    }
    catch (error) {
        console.error('Error fetching MAC address:', error);
        res.status(500).json({ error: 'Unable to retrieve MAC address' });
    }
});
// Not Found Route Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
// Global Error Handler
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "An unexpected error occurred",
    });
});
console.log(process.cwd());
exports.default = app;
