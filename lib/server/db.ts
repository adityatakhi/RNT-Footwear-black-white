import mongoose from "mongoose";

type Cache = { connection: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
declare global { var mongooseCache: Cache | undefined; }
const cache = global.mongooseCache ?? (global.mongooseCache = { connection: null, promise: null });

export async function connectDb() {
  if (cache.connection) return cache.connection;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  cache.promise ??= mongoose.connect(uri, { maxPoolSize: 20, minPoolSize: 2, serverSelectionTimeoutMS: 8000, autoIndex: process.env.NODE_ENV !== "production" });
  try { cache.connection = await cache.promise; return cache.connection; }
  catch (error) { cache.promise = null; throw error; }
}
