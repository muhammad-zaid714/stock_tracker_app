import WatchlistAlerts from "@/components/WatchlistAlerts";
import WatchlistTable from "@/components/WatchlistTable";
import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import { getBasicFinancials, getCompanyProfile, getQuote } from "@/lib/actions/finnhub.actions";
import { getUserAlerts } from "@/lib/actions/alert.actions";
import WatchlistControls from "../../../components/WatchlistControls";

type WatchlistRow = {
  symbol: string;
  company: string;
  addedAt?: string | Date;
  price?: number;
  changePercent?: number;
  marketCap?: number;
  peRatio?: number;
};

const buildWatchlistRows = async (symbols: string[], fallbackCompanyMap: Map<string, string>) => {
  const results = await Promise.allSettled(
    symbols.map(async (symbol) => {
      const [quote, profile, financials] = await Promise.all([
        getQuote(symbol),
        getCompanyProfile(symbol),
        getBasicFinancials(symbol),
      ]);

      return {
        symbol,
        company: profile?.name || fallbackCompanyMap.get(symbol) || symbol,
        price: quote?.c,
        changePercent: quote?.dp,
        marketCap: profile?.marketCapitalization,
        peRatio: financials?.metric?.peTTM,
      } as WatchlistRow;
    })
  );

  return results
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter(Boolean) as WatchlistRow[];
};

export default async function WatchlistPage() {
  const watchlist = await getUserWatchlist();
  const symbols = watchlist.map((item) => item.symbol);
  const fallbackCompanyMap = new Map(
    watchlist.map((item) => [item.symbol, item.company])
  );

  const rows = symbols.length
    ? await buildWatchlistRows(symbols, fallbackCompanyMap)
    : [];

  const alerts = await getUserAlerts();
  const alertSymbols = new Map(
    rows.map((row) => [row.symbol, { price: row.price, changePercent: row.changePercent }])
  );
  const alertCards = alerts.map((alert) => ({
    ...alert,
    _id: alert?._id?.toString?.() ?? String(alert._id ?? ""),
    createdAt: alert?.createdAt ? new Date(alert.createdAt).toISOString() : undefined,
    price: alertSymbols.get(alert.symbol)?.price,
    changePercent: alertSymbols.get(alert.symbol)?.changePercent,
  }));

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <WatchlistControls watchlistRows={rows} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WatchlistTable initialWatchlist={rows} />
          </div>
          <div>
            <WatchlistAlerts alerts={alertCards.slice(0, 6)} />
          </div>
        </div>
      </div>
    </div>
  );
}
