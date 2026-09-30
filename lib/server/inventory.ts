import { connectDb } from "@/lib/server/db";
import { ProductModel } from "@/models/product";

type Reservation = { productId: string; variantId: string; quantity: number };
export async function reserveInventory(requested: Reservation[]) {
  const database = await connectDb();
  const session = await database.startSession();
  try {
    const result: Reservation[] = [];
    await session.withTransaction(async () => {
      for (const line of requested) {
        const product = await ProductModel.findOne({ _id: line.productId, status: "published" }).session(session);
        const variant = product?.variants.id(line.variantId);
        if (!product || !variant || variant.stock - variant.reservedStock < line.quantity) throw new Error("INSUFFICIENT_STOCK");
        const changed = await ProductModel.updateOne({ _id: line.productId, variants: { $elemMatch: { _id: line.variantId, stock: variant.stock, reservedStock: variant.reservedStock } } }, { $inc: { "variants.$.reservedStock": line.quantity } }, { session });
        if (changed.modifiedCount !== 1) throw new Error("INVENTORY_CONFLICT");
        result.push(line);
      }
    }, { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
    return result;
  } finally { await session.endSession(); }
}
export async function commitInventory(reservations: Reservation[]) {
  const database = await connectDb();
  const session = await database.startSession();
  try {
    await session.withTransaction(async () => {
      for (const line of reservations) {
        const changed = await ProductModel.updateOne({ _id: line.productId, variants: { $elemMatch: { _id: line.variantId, stock: { $gte: line.quantity }, reservedStock: { $gte: line.quantity } } } }, { $inc: { "variants.$.stock": -line.quantity, "variants.$.reservedStock": -line.quantity } }, { session });
        if (changed.modifiedCount !== 1) throw new Error("INVENTORY_COMMIT_CONFLICT");
      }
    }, { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
  } finally { await session.endSession(); }
}
export async function releaseInventory(reservations: Reservation[]) {
  const database = await connectDb();
  const session = await database.startSession();
  try {
    await session.withTransaction(async () => {
      for (const line of reservations) {
        const changed = await ProductModel.updateOne({ _id: line.productId, variants: { $elemMatch: { _id: line.variantId, reservedStock: { $gte: line.quantity } } } }, { $inc: { "variants.$.reservedStock": -line.quantity } }, { session });
        if (changed.modifiedCount !== 1) throw new Error("INVENTORY_RELEASE_CONFLICT");
      }
    }, { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
  } finally { await session.endSession(); }
}
