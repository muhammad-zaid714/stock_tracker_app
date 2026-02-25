"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { connectToDatabase } from "@/database/mongoose";
import { Alert } from "@/database/models/alert.model";

const getSessionUser = async () => {
  const authInstance = await auth;
  const session = await authInstance.api.getSession({ headers: await headers() });
  return session?.user ?? null;
};

const normalizeSymbol = (symbol: string) => symbol.trim().toUpperCase();

export const getUserAlerts = async () => {
  const user = await getSessionUser();
  if (!user?.id) return [];

  try {
    await connectToDatabase();
    return await Alert.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }
};

export const createAlert = async ({
  symbol,
  company,
  condition,
  targetPrice,
  frequency,
}: {
  symbol: string;
  company: string;
  condition: "upper" | "lower";
  targetPrice: number;
  frequency?: "once-per-day" | "once-per-hour" | "once-per-minute";
}) => {
  const user = await getSessionUser();
  if (!user?.id) return { success: false, message: "Unauthorized" };

  try {
    await connectToDatabase();
    const alert = await Alert.create({
      userId: user.id,
      symbol: normalizeSymbol(symbol),
      company: company.trim(),
      condition,
      targetPrice,
      frequency: frequency || "once-per-day",
    });

    return {
      success: true,
      alert: {
        id: alert._id.toString(),
        symbol: alert.symbol,
        company: alert.company,
        condition: alert.condition,
        targetPrice: alert.targetPrice,
        frequency: alert.frequency,
        createdAt: alert.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error creating alert:", error);
    return { success: false, message: "Failed to create alert" };
  }
};

export const deleteAlert = async (alertId: string) => {
  const user = await getSessionUser();
  if (!user?.id) return { success: false };

  try {
    await connectToDatabase();
    await Alert.deleteOne({ _id: alertId, userId: user.id });
    return { success: true };
  } catch (error) {
    console.error("Error deleting alert:", error);
    return { success: false };
  }
};
