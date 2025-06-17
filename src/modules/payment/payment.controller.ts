import catchAsync from "../../utils/catchAsync";
const Stripe = require("stripe");
import nodemailer from "nodemailer";
import config from "../../config";

const stripe = Stripe(config.stripe_secret_key);

const OWNER_EMAIL = config.owner_email;
const STRIPE_NAVIGATE_URL = config.stripe_navigate_url;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "rayhanalmim1@gmail.com",
    pass: "zqazfffzddgcgbuz",
  },
});

const initiateStripePayment = catchAsync(async (req, res) => {
  const { items } = req.body;

  try {
    // Check if items exist in request body
    if (!items) {
      return res.status(400).json({ error: "No items provided in request body" });
    }

    // Convert single item to array if necessary
    const itemsArray = Array.isArray(items) ? items : [items];

    // Validate that we have valid items
    if (itemsArray.length === 0) {
      return res.status(400).json({ error: "No items provided for payment" });
    }

    // Validate each item's structure
    const validatedItems = itemsArray.map((item: any, index: number) => {
      if (!item || typeof item !== 'object') {
        throw new Error(`Invalid item at index ${index}: item must be an object`);
      }
      if (!item.name || typeof item.name !== 'string') {
        throw new Error(`Invalid item at index ${index}: name is required and must be a string`);
      }
      if (!item.price || typeof item.price !== 'number') {
        throw new Error(`Invalid item at index ${index}: price is required and must be a number`);
      }
      return {
        ...item,
        quantity: item.quantity || 1
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: validatedItems.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: req.body.success_url || `${STRIPE_NAVIGATE_URL}/success`,
      cancel_url: req.body.cancel_url || `${STRIPE_NAVIGATE_URL}/cancel`,
    });

    res.json({ id: session.id });
  } catch (err: any) {
    console.error("Stripe payment error:", err);
    res.status(500).json({ error: err.message || "Payment initiation failed" });
  }
});

const sendSingleProductEmail = catchAsync(async (req, res) => {
  try {
    const { email, address, product, quantity } = req.body;

    console.log(req.body);

    // Validate required fields
    if (!email || !address || !product) {
      return res.status(400).json({
        error: "Missing required fields: email, address, or product"
      });
    }

    const item = {
      name: product.title || 'Unknown Product',
      id: product.sku || 'N/A',
      price: parseFloat(product.regularPrice) || 0,
      quantity: parseInt(quantity) || 1
    };

    const totalAmount = item.price * item.quantity;

    const mailOptions = {
      from: `rayhanalmim1@gmail.com`,
      to: OWNER_EMAIL,
      subject: `New Order: Single Item`,
      html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🎉 New Order Received!</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0; font-size: 16px;">Order Confirmation</p>
        </div>

        <!-- Order Details Section -->
        <div style="padding: 30px 20px;">
          <div style="background: linear-gradient(to right, #f8fafc, #f1f5f9); padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center;">
              <span style="background: #2563eb; color: white; padding: 4px 8px; border-radius: 4px; margin-right: 10px;">📦</span>
              Order Details
            </h2>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; color: #64748b; font-weight: 500;">Product Name:</td>
                  <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${item.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #64748b; font-weight: 500;">SKU:</td>
                  <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${item.id}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #64748b; font-weight: 500;">Quantity:</td>
                  <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${item.quantity}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #64748b; font-weight: 500;">Price:</td>
                  <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">$${item.price.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Total Amount Section -->
          <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 20px; border-radius: 8px; margin-bottom: 25px; color: white;">
            <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #ffffff;">Total Amount</h3>
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #ffffff;">$${totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <!-- Customer Information Section -->
        <div style="padding: 0 20px 30px 20px;">
          <div style="background: linear-gradient(to right, #f8fafc, #f1f5f9); padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center;">
              <span style="background: #2563eb; color: white; padding: 4px 8px; border-radius: 4px; margin-right: 10px;">👤</span>
              Customer Information
            </h2>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; color: #64748b; font-weight: 500;">Email:</td>
                  <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #64748b; font-weight: 500;">Delivery Address:</td>
                  <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${address}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
          <p style="color: #64748b; font-size: 13px; margin: 0;">This is an automated message from your store system. Please do not reply.</p>
          <p style="color: #64748b; font-size: 13px; margin: 8px 0 0;">© ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
        </div>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent to owner successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: "Failed to send confirmation email",
      details: error.message
    });
  }
});

const sendMultipleProductsEmail = catchAsync(async (req, res) => {
  try {
    const { email, address, items } = req.body;

    // Validate required fields
    if (!email || !address || !items || !Array.isArray(items)) {
      return res.status(400).json({
        error: "Missing required fields: email, address, or items array"
      });
    }

    // Validate and format items
    const validatedItems = items.map((item: any) => {
      if (!item || typeof item !== 'object') {
        throw new Error('Invalid item format');
      }

      return {
        name: item.name || 'Unknown Product',
        id: item.id || 'N/A',
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1
      };
    });

    // Calculate total amount
    const totalAmount = validatedItems.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const itemsList = validatedItems.map((item: any) => `
      <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; color: #64748b; font-weight: 500;">Product Name:</td>
            <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${item.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #64748b; font-weight: 500;">SKU:</td>
            <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${item.id}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #64748b; font-weight: 500;">Quantity:</td>
            <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${item.quantity}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #64748b; font-weight: 500;">Price:</td>
            <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        </table>
      </div>
    `).join('');

    const mailOptions = {
      from: `rayhanalmim1@gmail.com`,
      to: OWNER_EMAIL,
      subject: `New Order: Multiple Items`,
      html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🎉 New Order Received!</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0; font-size: 16px;">Order Confirmation</p>
        </div>

        <!-- Order Items Section -->
        <div style="padding: 30px 20px;">
          <div style="background: linear-gradient(to right, #f8fafc, #f1f5f9); padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center;">
              <span style="background: #2563eb; color: white; padding: 4px 8px; border-radius: 4px; margin-right: 10px;">📦</span>
              Order Items
            </h2>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              ${itemsList}
            </div>
          </div>

          <!-- Total Amount Section -->
          <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 20px; border-radius: 8px; margin-bottom: 25px; color: white;">
            <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #ffffff;">Total Order Value</h3>
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #ffffff;">$${totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <!-- Customer Information Section -->
        <div style="padding: 0 20px 30px 20px;">
          <div style="background: linear-gradient(to right, #f8fafc, #f1f5f9); padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center;">
              <span style="background: #2563eb; color: white; padding: 4px 8px; border-radius: 4px; margin-right: 10px;">👤</span>
              Customer Information
            </h2>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; color: #64748b; font-weight: 500;">Email:</td>
                  <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #64748b; font-weight: 500;">Delivery Address:</td>
                  <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${address}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
          <p style="color: #64748b; font-size: 13px; margin: 0;">This is an automated message from your store system. Please do not reply.</p>
          <p style="color: #64748b; font-size: 13px; margin: 8px 0 0;">© ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
        </div>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent to owner successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: "Failed to send confirmation email",
      details: error.message
    });
  }
});

export const PaymentController = {
  initiateStripePayment,
  sendSingleProductEmail,
  sendMultipleProductsEmail,
};
