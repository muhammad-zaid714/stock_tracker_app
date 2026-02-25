'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import WatchlistButton from "@/components/WatchlistButton";
import FullPageLoader from "@/components/FullPageLoader";
import { formatMarketCapValue, formatPrice, formatChangePercent, getChangeColorClass } from "@/lib/utils";
import { createAlert } from "@/lib/actions/alert.actions";
import { toast } from "sonner";

interface WatchlistItemRow {
  symbol: string;
  company: string;
  addedAt?: string | Date;
  price?: number;
  changePercent?: number;
  marketCap?: number;
  peRatio?: number;
}

export default function WatchlistTable({
  initialWatchlist,
  onAddAlert,
}: {
  initialWatchlist: WatchlistItemRow[];
  onAddAlert?: (item: WatchlistItemRow) => void;
}) {
  const router = useRouter();
  const [items, setItems] = useState<WatchlistItemRow[]>(initialWatchlist || []);
  const [loadingAlert, setLoadingAlert] = useState<string | null>(null);

  const rows = useMemo(() => items, [items]);

  const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
    if (!isAdded) {
      setItems((prev) => prev.filter((item) => item.symbol !== symbol));
    }
  };

  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-10 text-center">
        <p className="text-lg font-semibold text-gray-200">Your watchlist is empty</p>
        <p className="mt-2 text-sm text-gray-500">Search for stocks and tap the star to add them here.</p>
      </div>
    );
  }

  return (
    <FullPageLoader show={Boolean(loadingAlert)} text="Creating alert...">
    <div className="rounded-2xl border border-white/10 bg-neutral-900/60 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-linear-to-r from-neutral-900/80 to-neutral-900/40">
        <div>
          <h2 className="text-xl font-bold text-white">Watchlist</h2>
          <p className="text-sm text-gray-500">Track your favorite stocks</p>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-semibold border border-emerald-500/20">
          {rows.length} stocks
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-900/80 text-gray-400 text-xs uppercase tracking-wide sticky top-0">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Company</th>
              <th className="text-left px-6 py-3 font-medium">Symbol</th>
              <th className="text-left px-6 py-3 font-medium">Price</th>
              <th className="text-left px-6 py-3 font-medium">Change</th>
              <th className="text-left px-6 py-3 font-medium">Market Cap</th>
              <th className="text-left px-6 py-3 font-medium">P/E</th>
              <th className="text-right px-6 py-3 font-medium">Alert</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((item) => (
              <tr key={item.symbol} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 text-white font-medium">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-xs text-emerald-300">
                      {item.symbol.slice(0, 2)}
                    </span>
                    <div>
                      <div className="text-white font-semibold group-hover:text-emerald-200 transition-colors">
                        {item.company}
                      </div>
                      <div className="text-xs text-gray-500">NASDAQ</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-emerald-400 font-mono font-semibold">{item.symbol}</td>
                <td className="px-6 py-4 text-gray-200">
                  {item.price ? formatPrice(item.price) : "-"}
                </td>
                <td className={`px-6 py-4 font-semibold ${getChangeColorClass(item.changePercent)}`}>
                  {item.changePercent ? formatChangePercent(item.changePercent) : "-"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {item.marketCap ? formatMarketCapValue(item.marketCap) : "-"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {item.peRatio ? item.peRatio.toFixed(1) : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 px-3 py-1 text-xs font-semibold hover:bg-yellow-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Add alert"
                      disabled={loadingAlert === item.symbol}
                      onClick={async () => {
                        const targetPrice = item.price ? Number((item.price * 1.05).toFixed(2)) : undefined;
                        if (!targetPrice) {
                          toast.error("Price data unavailable", {
                            description: "We couldn't fetch the latest price for this stock.",
                            className: "bg-neutral-900 text-white border border-white/10 shadow-2xl",
                            descriptionClassName: "text-gray-400",
                          });
                          return;
                        }

                        setLoadingAlert(item.symbol);
                        try {
                          const result = await createAlert({
                            symbol: item.symbol,
                            company: item.company,
                            condition: "upper",
                            targetPrice,
                            frequency: "once-per-day",
                          });
                          if (!result?.success) {
                            toast.error("Alert not created", {
                              description: result?.message || "Please try again in a moment.",
                              className: "bg-neutral-900 text-white border border-white/10 shadow-2xl",
                              descriptionClassName: "text-gray-400",
                            });
                            setLoadingAlert(null);
                            return;
                          }
                          onAddAlert?.(item);
                          router.refresh();
                          setTimeout(() => setLoadingAlert(null), 1200);
                        } catch (error) {
                          setLoadingAlert(null);
                          console.error("Error creating alert:", error);
                          toast.error("Alert failed", {
                            description: "Something went wrong while creating the alert.",
                            className: "bg-neutral-900 text-white border border-white/10 shadow-2xl",
                            descriptionClassName: "text-gray-400",
                          });
                        }
                      }}
                      type="button"
                    >
                      Add Alert
                    </button>
                    <WatchlistButton
                      symbol={item.symbol}
                      company={item.company}
                      initialInWatchlist
                      type="icon"
                      showTrashIcon
                      onWatchlistChange={handleWatchlistChange}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </FullPageLoader>
  );
}
