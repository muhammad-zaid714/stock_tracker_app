'use client';

import { formatChangePercent, formatPrice, getChangeColorClass } from "@/lib/utils";

interface AlertItem {
  _id?: string;
  symbol: string;
  company: string;
  price?: number;
  changePercent?: number;
  condition?: "upper" | "lower";
  targetPrice?: number;
  frequency?: "once-per-day" | "once-per-hour" | "once-per-minute";
  logo?: string;
}

const formatFrequency = (value?: string) => {
  switch (value) {
    case "once-per-hour":
      return "Once per hour";
    case "once-per-minute":
      return "Once per minute";
    default:
      return "Once per day";
  }
};

export default function WatchlistAlerts({ alerts }: { alerts: AlertItem[] }) {
  if (!alerts.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 text-center">
        <p className="text-gray-200 font-semibold">No alerts yet</p>
        <p className="text-sm text-gray-500 mt-2">Add alerts from your watchlist table.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/60 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white">Alerts</h2>
          <p className="text-sm text-gray-500">Price triggers and watch targets</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {alerts.map((item) => {
          const target = item.targetPrice;
          return (
            <div key={item._id ?? item.symbol} className="rounded-xl border border-white/10 bg-neutral-900/80 p-4 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.symbol)}&background=0D0F12&color=FACC15&size=64`}
                    alt={`${item.symbol} logo`}
                    className="h-10 w-10 rounded-full border border-white/10 bg-neutral-900 object-contain"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-white font-semibold">{item.company}</p>
                    <p className="text-xs text-gray-500">{item.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-200 font-semibold">
                    {item.price ? formatPrice(item.price) : "-"}
                  </p>
                  <p className={`text-xs font-semibold ${getChangeColorClass(item.changePercent)}`}>
                    {item.changePercent ? formatChangePercent(item.changePercent) : ""}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                <div>
                  Alert:{" "}
                  <span className="text-white">
                    {target
                      ? `Price ${item.condition === "lower" ? "<" : ">"} ${formatPrice(target)}`
                      : "-"}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wide bg-white/5 px-2 py-1 rounded-full">
                  {formatFrequency(item.frequency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
