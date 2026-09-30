import { Schema, model, models } from "mongoose";
const CouponSchema = new Schema({ code: { type: String, required: true, trim: true, uppercase: true, unique: true, index: true }, type: { type: String, enum: ["percent", "fixed"], required: true }, value: { type: Number, required: true, min: 0 }, startsAt: { type: Date }, endsAt: { type: Date }, usageLimit: { type: Number, min: 1 }, usageCount: { type: Number, default: 0, min: 0 }, active: { type: Boolean, default: false, index: true }, minimumSubtotal: { type: Number, default: 0, min: 0 } }, { timestamps: true, versionKey: false });
CouponSchema.index({ active: 1, startsAt: 1, endsAt: 1 });
export const CouponModel = models.Coupon || model("Coupon", CouponSchema);
