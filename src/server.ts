import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;

// For Vercel deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}