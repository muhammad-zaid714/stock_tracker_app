"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
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

    const user = (await db.collection("user").findOne({ email })) as BetterAuthUser | null;
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

const getSessionUser = async () => {
  const authInstance = await auth;
  const session = await authInstance.api.getSession({ headers: await headers() });
  return session?.user ?? null;
};

const normalizeSymbol = (symbol: string) => symbol.trim().toUpperCase();

export const getWatchlistSymbolsByUserId = async (userId: string): Promise<string[]> => {
  if (!userId) return [];
  try {
    await connectToDatabase();
    const items = await Watchlist.find({ userId })
      .select("symbol -_id")
      .lean<Array<{ symbol: string }>>();
    return items.map((item) => item.symbol);
  } catch (error) {
    console.error("Error fetching watchlist symbols by userId:", error);
    return [];
  }
};

export const getUserWatchlist = async () => {
  const user = await getSessionUser();
  if (!user?.id) return [];

  try {
    await connectToDatabase();
    return await Watchlist.find({ userId: user.id })
      .sort({ addedAt: -1 })
      .lean();
  } catch (error) {
    console.error("Error fetching user watchlist:", error);
    return [];
  }
};

export const toggleWatchlist = async ({
  symbol,
  company,
}: {
  symbol: string;
  company?: string;
}) => {
  const user = await getSessionUser();
  if (!user?.id) return { success: false, action: "unauthorized" as const };

  try {
    await connectToDatabase();
    const normalizedSymbol = normalizeSymbol(symbol);
    const normalizedCompany = (company || normalizedSymbol).trim();

    const existing = await Watchlist.findOne({
      userId: user.id,
      symbol: normalizedSymbol,
    }).lean();

    if (existing) {
      await Watchlist.deleteOne({ userId: user.id, symbol: normalizedSymbol });
      return { success: true, action: "removed" as const };
    }

    await Watchlist.create({
      userId: user.id,
      symbol: normalizedSymbol,
      company: normalizedCompany,
    });

    return { success: true, action: "added" as const };
  } catch (error) {
    console.error("Error toggling watchlist:", error);
    return { success: false, action: "error" as const };
  }
};
