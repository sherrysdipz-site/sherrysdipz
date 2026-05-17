import { logger } from "./logger";

export interface OrderRow {
  date: string;
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  items: string;
  total: string;
  fulfillmentType: string;
  deliveryAddress: string;
  paymentMethod: string;
  notes: string;
}

export async function appendOrderToSheet(order: OrderRow): Promise<void> {
  const sheetsClient = getGoogleSheetsClient();
  if (!sheetsClient) {
    logger.warn("Google Sheets not configured — skipping sheet append");
    return;
  }

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    logger.warn("GOOGLE_SHEET_ID not set — skipping sheet append");
    return;
  }

  try {
    const row = [
      order.date,
      order.orderId,
      order.customerName,
      order.phone,
      order.email,
      order.items,
      order.total,
      order.fulfillmentType,
      order.deliveryAddress,
      order.paymentMethod,
      order.notes,
    ];

    await sheetsClient.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    logger.info({ orderId: order.orderId }, "Order appended to Google Sheet");
  } catch (err) {
    logger.error({ err, orderId: order.orderId }, "Failed to append order to Google Sheet");
    throw err;
  }
}

function getGoogleSheetsClient(): any | null {
  // This will be populated once the Google Sheets integration is connected
  // via Replit's connector proxy. The integration code will be injected here.
  // For now return null if the integration env vars are not present.
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  if (!hostname) return null;

  try {
    // Lazy require to avoid crashing if googleapis is not installed
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getUncachableGoogleSheetsClient } = require("./sheets-client");
    return getUncachableGoogleSheetsClient();
  } catch {
    return null;
  }
}
