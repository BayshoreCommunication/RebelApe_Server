import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  owner_email: process.env.OWNER_EMAIL,
  stripe_navigate_url: process.env.STRIPE_NAVIGATE_URL,
};