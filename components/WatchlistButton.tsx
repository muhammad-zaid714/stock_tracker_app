'use client';

import { Button } from "@/components/ui/button";
import { Loader2, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toggleWatchlist } from "@/lib/actions/watchlist.actions";

interface WatchlistButtonProps {
  symbol: string;
  company?: string;
  initialInWatchlist?: boolean;
  type?: "button" | "icon";
  showTrashIcon?: boolean;
  onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
}

export default function WatchlistButton({
  symbol,
  company,
  initialInWatchlist = false,
  type = "button",
  showTrashIcon = false,
  onWatchlistChange,
}: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleWatchlist = async () => {
    setIsLoading(true);
    try {
      const result = await toggleWatchlist({
        symbol,
        company: company || symbol,
      });

      if (result?.success) {
        const isAdded = result.action === "added";
        setInWatchlist(isAdded);
        onWatchlistChange?.(symbol, isAdded);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (type === "icon") {
    return (
      <button
        type="button"
        onClick={handleToggleWatchlist}
        disabled={isLoading}
        aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-neutral-900/70 text-gray-300 transition-all duration-300 hover:border-yellow-400/40 hover:text-yellow-400 disabled:opacity-60"
      >
        {showTrashIcon ? (
          <Trash2 className="h-4 w-4" />
        ) : (
          <Star className={`h-4 w-4 ${inWatchlist ? 'fill-current text-yellow-400' : ''}`} />
        )}
      </button>
    );
  }

  return (
    <div className="relative group">
      {/* Animated Glow Effect */}
      <div className={`absolute -inset-1 rounded-2xl blur-lg transition-all duration-500 opacity-30 group-hover:opacity-60 ${
        inWatchlist 
          ? 'bg-linear-to-r from-red-500 via-orange-500 to-red-500 animate-gradientRotate' 
          : 'bg-linear-to-r from-yellow-400 via-amber-400 to-yellow-500 animate-gradientRotate'
      }`}></div>
      
      <Button
        onClick={handleToggleWatchlist}
        disabled={isLoading}
        className={`relative w-full h-14 font-bold text-base transition-all duration-500 shadow-2xl rounded-2xl overflow-hidden group-hover:scale-[1.02] active:scale-[0.98] ${
          inWatchlist 
            ? 'bg-linear-to-r from-red-500 via-orange-500 to-red-600 hover:from-red-600 hover:via-orange-600 hover:to-red-700 text-white' 
            : 'bg-linear-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 text-gray-900'
        } border-0`}
      >
        {/* Button Shimmer Effect */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Content */}
        <div className="relative flex items-center justify-center gap-3 z-10">
          <div className={`transition-all duration-500 ${inWatchlist ? 'rotate-0' : 'group-hover:rotate-12'}`}>
            <Star className={`h-6 w-6 transition-all duration-500 ${
              inWatchlist ? 'fill-current animate-pulse' : 'group-hover:scale-110'
            }`} />
          </div>
          <span className="font-black tracking-wide">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </span>
            ) : inWatchlist ? (
              'Remove from Watchlist'
            ) : (
              'Add to Watchlist'
            )}
          </span>
        </div>
      </Button>
    </div>
  );
}
