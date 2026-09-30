import { Model, Schema, model, models } from "mongoose";
export type UserRecord = { email: string; name?: string; passwordHash: string; role: "customer" | "admin"; emailVerifiedAt: Date | null; disabledAt: Date | null };
const UserSchema = new Schema<UserRecord>({
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, unique: true, index: true },
  name: { type: String, trim: true, maxlength: 120 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "admin"], default: "customer", required: true, index: true },
  emailVerifiedAt: { type: Date, default: null },
  disabledAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });
export const UserModel = (models.User as Model<UserRecord> | undefined) ?? model<UserRecord>("User", UserSchema);
