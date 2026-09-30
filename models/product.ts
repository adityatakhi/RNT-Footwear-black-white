import { Schema, model, models } from "mongoose";

const VariantSchema = new Schema({
  sku: { type: String, required: true, trim: true },
  color: { type: String, required: true },
  size: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  reservedStock: { type: Number, required: true, min: 0, default: 0 },
  images: [{ type: String }],
  modelUrl: { type: String, default: null }
}, { _id: true });

VariantSchema.virtual("availableStock").get(function () {
  return Math.max(0, this.stock - this.reservedStock);
});

const SwatchSchema = new Schema({
  name: { type: String, required: true },
  tone: { type: String, enum: ["chalk", "volt", "ember", "slate"], required: true }
}, { _id: false });

const ProductSchema = new Schema({
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  name: { type: String, required: true, trim: true, maxlength: 160 },
  subtitle: { type: String, trim: true, maxlength: 180 },
  category: { type: String, enum: ["Road", "Court", "Everyday"], default: "Everyday", index: true },
  price: { type: Number, min: 0, default: 0 },
  colorway: { type: String, trim: true, maxlength: 80 },
  tone: { type: String, enum: ["chalk", "volt", "ember", "slate"], default: "chalk" },
  swatches: { type: [SwatchSchema], default: [] },
  sizes: [{ type: Number }],
  tag: { type: String, trim: true, maxlength: 40 },
  images: [{ type: String }],
  details: [{ type: String }],
  placeholder: { type: Boolean, default: true },
  status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
  categoryId: { type: Schema.Types.ObjectId, index: true },
  description: { type: String, maxlength: 6000 },
  variants: { type: [VariantSchema], default: [] },
  seoTitle: { type: String, maxlength: 70 },
  seoDescription: { type: String, maxlength: 170 }
}, { timestamps: true, versionKey: false });

ProductSchema.index({ status: 1, category: 1, createdAt: -1 });
ProductSchema.index({ status: 1, categoryId: 1, createdAt: -1 });
ProductSchema.index({ "variants.sku": 1 }, { unique: true, sparse: true });

export const ProductModel = models.Product || model("Product", ProductSchema);
