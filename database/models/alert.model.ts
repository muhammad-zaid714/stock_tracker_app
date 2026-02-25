import { Document, Model, Schema, model, models } from "mongoose";

export interface AlertItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  condition: "upper" | "lower";
  targetPrice: number;
  frequency: "once-per-day" | "once-per-hour" | "once-per-minute";
  createdAt: Date;
}

const alertSchema = new Schema<AlertItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    condition: { type: String, enum: ["upper", "lower"], required: true },
    targetPrice: { type: Number, required: true },
    frequency: {
      type: String,
      enum: ["once-per-day", "once-per-hour", "once-per-minute"],
      default: "once-per-day",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

alertSchema.index({ userId: 1, symbol: 1, condition: 1, targetPrice: 1 });

export const Alert: Model<AlertItem> =
  (models?.Alert as Model<AlertItem>) || model<AlertItem>("Alert", alertSchema);
