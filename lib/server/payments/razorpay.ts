import { createHmac, timingSafeEqual } from "node:crypto";
export type PaymentOrder = { id: string; amount: number; currency: string; receipt: string };
export interface PaymentProvider {
  createOrder(input: { amountPaise: number; receipt: string; currency: "INR"; notes?: Record<string, string> }): Promise<PaymentOrder>;
  verifyPayment(input: { orderId: string; paymentId: string; signature: string }): boolean;
  verifyWebhook(rawBody: string, signature: string): boolean;
}
function constantTimeHexEqual(expected: string, supplied: string) {
  if (!/^[a-f\d]+$/i.test(supplied) || expected.length !== supplied.length) return false;
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(supplied, "hex"));
}
export function createRazorpayProvider(): PaymentProvider {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!keyId || !keySecret || !webhookSecret) throw new Error("Razorpay server configuration is incomplete");
  return {
    async createOrder(input) {
      if (!Number.isInteger(input.amountPaise) || input.amountPaise <= 0) throw new Error("Payment amount must be a positive integer in paise");
      const authorization = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const response = await fetch("https://api.razorpay.com/v1/orders", { method: "POST", headers: { Authorization: `Basic ${authorization}`, "Content-Type": "application/json" }, body: JSON.stringify({ amount: input.amountPaise, currency: input.currency, receipt: input.receipt, notes: input.notes }), signal: AbortSignal.timeout(8000), cache: "no-store" });
      if (!response.ok) throw new Error("Razorpay order creation failed");
      const order = await response.json() as PaymentOrder;
      return { id: order.id, amount: order.amount, currency: order.currency, receipt: order.receipt };
    },
    verifyPayment({ orderId, paymentId, signature }) { const expected = createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex"); return constantTimeHexEqual(expected, signature); },
    verifyWebhook(rawBody, signature) { const expected = createHmac("sha256", webhookSecret).update(rawBody).digest("hex"); return constantTimeHexEqual(expected, signature); }
  };
}
