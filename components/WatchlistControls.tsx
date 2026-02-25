'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toggleWatchlist } from "@/lib/actions/watchlist.actions";
import { createAlert } from "@/lib/actions/alert.actions";
import { formatPrice } from "@/lib/utils";

interface WatchlistRow {
  symbol: string;
  company: string;
  price?: number;
}

export default function WatchlistControls({ watchlistRows }: { watchlistRows: WatchlistRow[] }) {
  const router = useRouter();
  const [openAddStock, setOpenAddStock] = useState(false);
  const [openAddAlert, setOpenAddAlert] = useState(false);

  const [symbol, setSymbol] = useState("");
  const [company, setCompany] = useState("");

  const [alertSymbol, setAlertSymbol] = useState("");
  const [condition, setCondition] = useState<"upper" | "lower">("upper");
  const [targetPrice, setTargetPrice] = useState("");
  const [frequency, setFrequency] = useState<"once-per-day" | "once-per-hour" | "once-per-minute">("once-per-day");

  const symbolOptions = useMemo(() => watchlistRows.map((row) => row.symbol), [watchlistRows]);
  const symbolMap = useMemo(() => new Map(watchlistRows.map((row) => [row.symbol, row])), [watchlistRows]);

  const handleAddStock = async () => {
    if (!symbol.trim()) return;
    await toggleWatchlist({ symbol: symbol.trim(), company: company.trim() || symbol.trim() });
    setOpenAddStock(false);
    setSymbol("");
    setCompany("");
    router.refresh();
  };

  const handleAddAlert = async () => {
    if (!alertSymbol || !targetPrice) return;
    const selected = symbolMap.get(alertSymbol);
    await createAlert({
      symbol: alertSymbol,
      company: selected?.company || alertSymbol,
      condition,
      targetPrice: Number(targetPrice),
      frequency,
    });
    setOpenAddAlert(false);
    setAlertSymbol("");
    setTargetPrice("");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-emerald-300 border border-emerald-500/20">
          Live Watchlist
        </div>
        <h1 className="mt-3 text-3xl font-black text-white">Watchlist</h1>
        <p className="text-gray-400">Track, alert, and act on your favorite stocks</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          className="rounded-xl bg-linear-to-r from-yellow-400 via-amber-400 to-yellow-500 text-gray-900 font-semibold px-5 py-2 text-sm shadow-lg hover:shadow-yellow-500/30 transition-all"
          onClick={() => setOpenAddStock(true)}
          type="button"
        >
          Add Stock
        </Button>
        <Button
          className="rounded-xl bg-white/5 text-yellow-300 border border-yellow-500/20 px-5 py-2 text-sm font-semibold hover:bg-yellow-500/10 transition-all"
          onClick={() => setOpenAddAlert(true)}
          type="button"
        >
          Create Alert
        </Button>
      </div>

      {/* Add Stock Dialog */}
      <Dialog open={openAddStock} onOpenChange={setOpenAddStock}>
        <DialogContent className="max-w-md bg-neutral-900 border border-white/10 rounded-2xl">
          <DialogTitle className="text-white">Add Stock</DialogTitle>
          <div className="space-y-4">
            <Input
              placeholder="Symbol (e.g. AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <Input
              placeholder="Company name (optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Button onClick={handleAddStock} className="w-full bg-linear-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold">
              Add to Watchlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Alert Dialog */}
      <Dialog open={openAddAlert} onOpenChange={setOpenAddAlert}>
        <DialogContent className="max-w-md bg-neutral-900 border border-white/10 rounded-2xl">
          <DialogTitle className="text-white">Create Alert</DialogTitle>
          <div className="space-y-4">
            <Select value={alertSymbol} onValueChange={setAlertSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent>
                {symbolOptions.map((symbol) => (
                  <SelectItem key={symbol} value={symbol}>
                    {symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {alertSymbol && (
              <div className="text-sm text-gray-500">
                Current price: {symbolMap.get(alertSymbol)?.price ? formatPrice(symbolMap.get(alertSymbol)?.price as number) : "-"}
              </div>
            )}

            <Select value={condition} onValueChange={(value) => setCondition(value as "upper" | "lower")}>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upper">Price above</SelectItem>
                <SelectItem value="lower">Price below</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Target price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />

            <Select value={frequency} onValueChange={(value) => setFrequency(value as "once-per-day" | "once-per-hour" | "once-per-minute")}>
              <SelectTrigger>
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once-per-day">Once per day</SelectItem>
                <SelectItem value="once-per-hour">Once per hour</SelectItem>
                <SelectItem value="once-per-minute">Once per minute</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleAddAlert} className="w-full bg-linear-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold">
              Create Alert
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
