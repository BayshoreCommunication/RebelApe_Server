import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import os from 'os';
import connectDB from "./config/database";
import { PaymentRoute } from "./modules/payment/payment.route";
import { WarehouseRoute } from "./modules/warehouse/warehouse.route";
import { AuthRoute } from "./modules/auth/auth.route";

const app: Application = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true
}));

//applications route
app.use("/api", PaymentRoute);
app.use("/api", WarehouseRoute);
app.use("/api", AuthRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Warehouse Locator API - Server is running!");
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString()
  });
});

// Route to fetch MAC address
app.get('/getMacAddress', (req: Request, res: Response) => {
  try {
    const networkInterfaces = os.networkInterfaces();
    const macAddresses: string[] = [];

    Object.values(networkInterfaces).forEach((iface) => {
      iface?.forEach((config) => {
        if (config.mac !== '00:00:00:00:00:00') {
          macAddresses.push(config.mac);
        }
      });
    });

    res.status(200).json({ macAddress: macAddresses[0] || 'Unavailable' });
  } catch (error) {
    console.error('Error fetching MAC address:', error);
    res.status(500).json({ error: 'Unable to retrieve MAC address' });
  }
});

// Not Found Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
});

console.log(process.cwd());

export default app;