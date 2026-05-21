import { Resend } from "resend";
import { logger } from "./logger";

const FROM_EMAIL = "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "sherrysdipz@gmail.com";
const ETRANSFER_EMAIL = process.env.ETRANSFER_EMAIL ?? "sherrysdipz@gmail.com";

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  fulfillmentType: string;
  deliveryAddress?: string | null;
  paymentMethod: string;
  notes?: string | null;
  date: string;
}

function buildAdminEmailHtml(order: OrderEmailData): string {
  const itemRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #e8e0d5;">${i.name}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e8e0d5;text-align:center;">${i.quantity}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e8e0d5;text-align:right;">$${(i.quantity * i.price).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;background:#faf8f4;margin:0;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#4a6741;padding:24px 32px;">
      <h1 style="color:#f5eed8;margin:0;font-size:22px;letter-spacing:0.5px;">New Order — Sherry's Dipz</h1>
      <p style="color:#c8d9c4;margin:4px 0 0;font-size:14px;">Order #${order.orderId} · ${order.date}</p>
    </div>
    <div style="padding:28px 32px;">
      <h2 style="color:#2d2a24;font-size:16px;margin:0 0 16px;border-bottom:2px solid #e8e0d5;padding-bottom:8px;">Customer</h2>
      <p style="margin:4px 0;color:#4a4035;"><strong>Name:</strong> ${order.customerName}</p>
      <p style="margin:4px 0;color:#4a4035;"><strong>Phone:</strong> ${order.phone}</p>
      <p style="margin:4px 0;color:#4a4035;"><strong>Email:</strong> ${order.customerEmail}</p>
      <p style="margin:4px 0;color:#4a4035;"><strong>Fulfillment:</strong> ${order.fulfillmentType === "pickup" ? "Pickup" : "Delivery"}</p>
      ${order.deliveryAddress ? `<p style="margin:4px 0;color:#4a4035;"><strong>Address:</strong> ${order.deliveryAddress}</p>` : ""}
      <p style="margin:4px 0;color:#4a4035;"><strong>Payment:</strong> ${order.paymentMethod === "cash" ? "Cash" : "e-Transfer"}</p>
      ${order.notes ? `<p style="margin:4px 0;color:#4a4035;"><strong>Notes:</strong> ${order.notes}</p>` : ""}

      <h2 style="color:#2d2a24;font-size:16px;margin:24px 0 16px;border-bottom:2px solid #e8e0d5;padding-bottom:8px;">Order Items</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#f5eed8;">
            <th style="padding:8px 12px;text-align:left;color:#4a6741;">Item</th>
            <th style="padding:8px 12px;text-align:center;color:#4a6741;">Qty</th>
            <th style="padding:8px 12px;text-align:right;color:#4a6741;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:10px 12px;font-weight:bold;color:#2d2a24;">Total</td>
            <td style="padding:10px 12px;font-weight:bold;text-align:right;color:#4a6741;font-size:16px;">$${order.totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</body>
</html>`;
}

function buildCustomerEmailHtml(order: OrderEmailData): string {
  const etransferSection =
    order.paymentMethod === "etransfer"
      ? `
      <div style="background:#fff8e8;border:2px solid #d4a843;border-radius:8px;padding:20px 24px;margin:24px 0;">
        <h3 style="color:#8b6914;margin:0 0 10px;font-size:15px;">e-Transfer Instructions</h3>
        <p style="color:#5a4008;margin:4px 0;">Please send <strong>$${order.totalAmount.toFixed(2)}</strong> via e-Transfer to:</p>
        <p style="color:#4a6741;font-size:18px;font-weight:bold;margin:8px 0;">${ETRANSFER_EMAIL}</p>
        <p style="color:#5a4008;margin:4px 0;font-size:13px;">Please include your order number <strong>#${order.orderId}</strong> in the message.</p>
      </div>`
      : "";

  return `
<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;background:#faf8f4;margin:0;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#4a6741;padding:24px 32px;">
      <h1 style="color:#f5eed8;margin:0;font-size:22px;">Thank you, ${order.customerName}!</h1>
      <p style="color:#c8d9c4;margin:4px 0 0;font-size:14px;">Your order has been received.</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#4a4035;font-size:15px;">We've got your order and we're so excited to prepare it for you. Here's a summary:</p>
      
      <div style="background:#f5eed8;border-radius:8px;padding:16px 20px;margin:16px 0;">
        <p style="margin:4px 0;color:#4a4035;font-size:14px;"><strong>Order #:</strong> ${order.orderId}</p>
        <p style="margin:4px 0;color:#4a4035;font-size:14px;"><strong>Fulfillment:</strong> ${order.fulfillmentType === "pickup" ? "Pickup" : "Delivery"}</p>
        ${order.deliveryAddress ? `<p style="margin:4px 0;color:#4a4035;font-size:14px;"><strong>Delivery to:</strong> ${order.deliveryAddress}</p>` : ""}
        <p style="margin:4px 0;color:#4a4035;font-size:14px;"><strong>Payment:</strong> ${order.paymentMethod === "cash" ? "Cash on " + (order.fulfillmentType === "pickup" ? "pickup" : "delivery") : "e-Transfer"}</p>
        <p style="margin:8px 0 0;color:#4a6741;font-size:16px;font-weight:bold;"><strong>Total: $${order.totalAmount.toFixed(2)}</strong></p>
      </div>

      ${etransferSection}

      <p style="color:#7a6e65;font-size:13px;margin-top:24px;">We'll be in touch soon with pickup/delivery details. For questions, message us on Instagram or reply to this email.</p>
      <p style="color:#4a6741;font-size:13px;font-style:italic;margin-top:8px;">— Sherry's Dipz 🫙</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendOrderEmails(order: OrderEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("RESEND_API_KEY not set — skipping email send");
    return;
  }

  const resend = new Resend(apiKey);

  try {
    const [adminResult, customerResult] = await Promise.all([
      resend.emails.send({
        from: `Sherry's Dipz <${FROM_EMAIL}>`,
        to: [ADMIN_EMAIL],
        subject: `New Order #${order.orderId} — ${order.customerName} ($${order.totalAmount.toFixed(2)})`,
        html: buildAdminEmailHtml(order),
      }),
      resend.emails.send({
        from: `Sherry's Dipz <${FROM_EMAIL}>`,
        to: [order.customerEmail],
        subject: `Your Sherry's Dipz order is confirmed! (#${order.orderId})`,
        html: buildCustomerEmailHtml(order),
      }),
    ]);

    if (adminResult.error) {
      logger.error({ error: adminResult.error, orderId: order.orderId }, "Admin email failed");
      throw new Error(`Admin email failed: ${adminResult.error.message}`);
    }
    if (customerResult.error) {
      logger.error({ error: customerResult.error, orderId: order.orderId }, "Customer email failed");
      throw new Error(`Customer email failed: ${customerResult.error.message}`);
    }

    logger.info({ orderId: order.orderId }, "Order emails sent successfully");
  } catch (err) {
    logger.error({ err, orderId: order.orderId }, "Failed to send order emails");
    throw err;
  }
}
