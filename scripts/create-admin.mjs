import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!uri) throw new Error("Set MONGODB_URI in .env.local before creating an administrator.");
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Set a valid ADMIN_EMAIL in .env.local.");
if (!password || password.length < 14 || password.length > 128) throw new Error("Set a unique ADMIN_PASSWORD with at least 14 characters.");

const User = mongoose.models.User ?? mongoose.model("User", new mongoose.Schema({
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, unique: true, index: true },
  name: { type: String, trim: true, maxlength: 120 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "admin"], default: "customer", required: true, index: true },
  emailVerifiedAt: { type: Date, default: null },
  disabledAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false }));

await mongoose.connect(uri, { maxPoolSize: 2, serverSelectionTimeoutMS: 8000 });
try {
  const existing = await User.findOne({ email }).select("_id role").lean();
  if (existing) throw new Error("That email already has an account. Use an existing administrator or provision a new email.");
  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ email, passwordHash, role: "admin", emailVerifiedAt: new Date(), disabledAt: null });
  console.log("Administrator account created. Sign in at /account, then open /admin.");
} finally {
  await mongoose.disconnect();
}
