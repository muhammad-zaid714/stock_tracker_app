"use server";

import { formatArticle, getDateRange, validateArticle } from "@/lib/utils";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? "";

const getFinnhubApiKey = () => {
  if (!NEXT_PUBLIC_FINNHUB_API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_FINNHUB_API_KEY");
  }
  return NEXT_PUBLIC_FINNHUB_API_KEY;
};

export const fetchJSON = async <T>(
  url: string,
  revalidateSeconds?: number
): Promise<T> => {
  const options: RequestInit & { next?: { revalidate: number } } =
    typeof revalidateSeconds === "number"
      ? { cache: "force-cache", next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" };

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Finnhub request failed: ${response.status} ${response.statusText} ${errorText}`.trim()
    );
  }

  return (await response.json()) as T;
};

const buildCompanyNewsUrl = (symbol: string, from: string, to: string) =>
  `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${getFinnhubApiKey()}`;

const buildGeneralNewsUrl = () =>
  `${FINNHUB_BASE_URL}/news?category=general&token=${getFinnhubApiKey()}`;

const buildQuoteUrl = (symbol: string) =>
  `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${getFinnhubApiKey()}`;

const buildProfileUrl = (symbol: string) =>
  `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${getFinnhubApiKey()}`;

const buildMetricUrl = (symbol: string) =>
  `${FINNHUB_BASE_URL}/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all&token=${getFinnhubApiKey()}`;

const getGeneralMarketNews = async (): Promise<MarketNewsArticle[]> => {
  const url = buildGeneralNewsUrl();
  const rawArticles = await fetchJSON<RawNewsArticle[]>(url);

  const results: MarketNewsArticle[] = [];
  const seen = new Set<string>();

  for (const article of rawArticles) {
    if (!validateArticle(article)) continue;

    const key = `${article.id ?? ""}|${article.url ?? ""}|${article.headline ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);

    results.push(formatArticle(article, false, undefined, results.length));

    if (results.length >= 6) break;
  }

  return results;
};

export const getNews = async (symbols?: string[]): Promise<MarketNewsArticle[]> => {
  try {
    const { from, to } = getDateRange(5);
    const cleanedSymbols = (symbols ?? [])
      .map((symbol) => symbol.trim().toUpperCase())
      .filter(Boolean);

    if (cleanedSymbols.length > 0) {
      const results: MarketNewsArticle[] = [];
      const seen = new Set<string>();

      for (let i = 0; i < 6; i += 1) {
        const symbol = cleanedSymbols[i % cleanedSymbols.length];
        const url = buildCompanyNewsUrl(symbol, from, to);
        const companyNews = await fetchJSON<RawNewsArticle[]>(url);

        const candidate = companyNews.find((article) => {
          if (!validateArticle(article)) return false;
          const key = `${article.id ?? ""}|${article.url ?? ""}|${article.headline ?? ""}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        if (candidate) {
          results.push(formatArticle(candidate, true, symbol, results.length));
        }
      }

      if (results.length === 0) {
        return await getGeneralMarketNews();
      }

      return results.sort((a, b) => b.datetime - a.datetime).slice(0, 6);
    }

    return await getGeneralMarketNews();
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news");
  }
};

export const searchStocks = async (query: string): Promise<FinnhubSearchResult[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(query.trim())}&token=${getFinnhubApiKey()}`;
    const response = await fetchJSON<FinnhubSearchResponse>(url);
    
    if (!response.result || !Array.isArray(response.result)) {
      return [];
    }

    return response.result
      .filter(
        (stock) =>
          stock.symbol &&
          stock.description &&
          (stock.type === 'Common Stock' || stock.type === 'ETF' || !stock.type)
      )
      .map((stock) => ({
        symbol: stock.symbol.toUpperCase(),
        description: stock.description,
        displaySymbol: stock.displaySymbol || stock.symbol,
        type: stock.type || 'Stock',
      }))
      .slice(0, 10);
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};

export const getQuote = async (symbol: string): Promise<QuoteData | null> => {
  try {
    const url = buildQuoteUrl(symbol);
    return await fetchJSON<QuoteData>(url, 60);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return null;
  }
};

export const getCompanyProfile = async (symbol: string): Promise<ProfileData | null> => {
  try {
    const url = buildProfileUrl(symbol);
    return await fetchJSON<ProfileData>(url, 3600);
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return null;
  }
};

export const getBasicFinancials = async (
  symbol: string
): Promise<{ metric?: { peTTM?: number } } | null> => {
  try {
    const url = buildMetricUrl(symbol);
    return await fetchJSON<{ metric?: { peTTM?: number } }>(url, 3600);
  } catch (error) {
    console.error("Error fetching basic financials:", error);
    return null;
  }
};

