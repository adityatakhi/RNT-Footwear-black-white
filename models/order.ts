import { Schema, model, models } from "mongoose";
const OrderItemSchema = new Schema({ productId: { type: Schema.Types.ObjectId, required: true }, variantId: { type: Schema.Types.ObjectId, required: true }, sku: { type: String, required: true }, title: { type: String, required: true }, size: { type: Number, required: true }, color: { type: String, required: true }, quantity: { type: Number, required: true, min: 1 }, unitPrice: { type: Number, required: true, min: 0 }, lineTotal: { type: Number, required: true, min: 0 } }, { _id: false });
const AddressSchema = new Schema({ name: String, line1: String, line2: String, city: String, region: String, postalCode: String, country: String }, { _id: false });
const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true }, userId: { type: Schema.Types.ObjectId, index: true }, email: { type: String, required: true, lowercase: true }, items: { type: [OrderItemSchema], required: true },
  shippingAddress: { type: AddressSchema, required: true }, billingAddress: { type: AddressSchema }, subtotal: { type: Number, required: true }, shipping: { type: Number, required: true, default: 0 }, tax: { type: Number, required: true, default: 0 }, discount: { type: Number, required: true, default: 0 }, total: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending", index: true }, orderStatus: { type: String, enum: ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "refunded"], default: "pending", index: true }, paymentReference: { type: String, sparse: true, index: true }
}, { timestamps: true, versionKey: false });
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
export const OrderModel = models.Order || model("Order", OrderSchema);
