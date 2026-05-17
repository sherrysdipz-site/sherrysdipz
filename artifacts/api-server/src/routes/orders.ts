import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { CreateOrderBody } from "@workspace/api-zod";
import { appendOrderToSheet, type OrderRow } from "../lib/sheets";
import { sendOrderEmails } from "../lib/email";

const router: IRouter = Router();

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const order = parsed.data;
  const orderId = randomUUID().split("-")[0].toUpperCase();
  const now = new Date();
  const dateStr = now.toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const itemsSummary = order.items
    .map((i) => `${i.quantity}x ${i.name} ($${i.price.toFixed(2)})`)
    .join(", ");

  const sheetRow: OrderRow = {
    date: dateStr,
    orderId,
    customerName: order.customerName,
    phone: order.phone,
    email: order.email,
    items: itemsSummary,
    total: `$${totalAmount.toFixed(2)}`,
    fulfillmentType: order.fulfillmentType,
    deliveryAddress: order.deliveryAddress ?? "",
    paymentMethod: order.paymentMethod,
    notes: order.notes ?? "",
  };

  try {
    await appendOrderToSheet(sheetRow);
  } catch (err) {
    req.log.error({ err }, "Google Sheets append failed");
  }

  try {
    await sendOrderEmails({
      orderId,
      customerName: order.customerName,
      customerEmail: order.email,
      phone: order.phone,
      items: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      totalAmount,
      fulfillmentType: order.fulfillmentType,
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod,
      notes: order.notes,
      date: dateStr,
    });
  } catch (err) {
    req.log.error({ err }, "Email send failed");
  }

  res.status(201).json({
    orderId,
    message: "Your order has been placed successfully!",
    totalAmount,
    etransferEmail:
      order.paymentMethod === "etransfer"
        ? (process.env.ADMIN_EMAIL ?? "sherrys.dipz@gmail.com")
        : null,
  });
});

export default router;
