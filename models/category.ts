import { Schema, model, models } from "mongoose";
const CategorySchema = new Schema({ slug: { type: String, required: true, unique: true, index: true }, name: { type: String, required: true, trim: true, maxlength: 80 }, status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true }, description: { type: String, maxlength: 500 } }, { timestamps: true, versionKey: false });
export const CategoryModel = models.Category || model("Category", CategorySchema);
