"use server";

import { Watchlist } from "@/database/models/watchlist.model";
import { connectToDatabase } from "@/database/mongoose";

interface BetterAuthUser {
  _id?: { toString: () => string };
  id?: string;
  email?: string;
}

export const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection not established");

    const user = (await db.collection("users").findOne({ email })) as BetterAuthUser | null;
    if (!user) return [];

    const userId = user.id ?? user._id?.toString() ?? "";
    if (!userId) return [];

    const items = await Watchlist.find({ userId })
      .select("symbol -_id")
      .lean<Array<{ symbol: string }>>();

    return items.map((item) => item.symbol);
  } catch (error) {
    console.error("Error fetching watchlist symbols:", error);
    return [];
  }
};
