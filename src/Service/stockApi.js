import axios from "axios";

const API_KEY = "E1JT1KAT5BAW1WRG";
const BASE_URL = "https://www.alphavantage.co/query";

// Set this to true to use mock data and avoid API limits
const USE_MOCK_DATA = false;

export const fetchStockData = async (symbol) => {
    if (USE_MOCK_DATA) return getMockHistory(symbol);
    
    try {
        const res = await axios.get(
            `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
        );

        if (res.data.Note || res.data.Information) {
            console.warn("API Limit reached, falling back to mock data");
            return getMockHistory(symbol);
        }

        if (!res.data["Time Series (Daily)"]) {
            throw new Error("Invalid stock symbol or no data found");
        }

        const raw = res.data["Time Series (Daily)"];
        return Object.keys(raw)
            .slice(0, 30) // Get last 30 days
            .map((date) => ({
                date,
                price: parseFloat(raw[date]["4. close"]),
            }))
            .reverse();

    } catch (error) {
        console.error("Fetch history error:", error);
        return getMockHistory(symbol);
    }
};

export const fetchStockQuote = async (symbol) => {
    if (USE_MOCK_DATA) return getMockQuote(symbol);

    try {
        const res = await axios.get(
            `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
        );

        if (res.data.Note || res.data.Information) {
            console.warn("API Limit reached, falling back to mock data for quote");
            return getMockQuote(symbol);
        }

        const data = res.data["Global Quote"];
        if (!data || Object.keys(data).length === 0) {
            return getMockQuote(symbol);
        }

        return {
            symbol: data["01. symbol"],
            name: getCompanyName(data["01. symbol"]),
            price: parseFloat(data["05. price"]),
            change: parseFloat(data["09. change"]),
            changePercent: data["10. change percent"],
            high: parseFloat(data["03. high"]),
            low: parseFloat(data["04. low"]),
            volume: parseInt(data["06. volume"]),
        };
    } catch (error) {
        console.error("Fetch quote error:", error);
        return getMockQuote(symbol);
    }
};

export const searchStocks = async (keywords) => {
    if (!keywords) return [];
    try {
        const res = await axios.get(
            `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`
        );

        if (res.data.Note || res.data.Information || !res.data.bestMatches) {
            console.warn("Search API Limit reached, using local fallback");
            // Local fallback for better UX
            const common = [
                { "1. symbol": "AAPL", "2. name": "Apple Inc.", "3. type": "Equity", "4. region": "United States" },
                { "1. symbol": "TSLA", "2. name": "Tesla, Inc.", "3. type": "Equity", "4. region": "United States" },
                { "1. symbol": "MSFT", "2. name": "Microsoft Corp.", "3. type": "Equity", "4. region": "United States" },
                { "1. symbol": "GOOGL", "2. name": "Alphabet Inc.", "3. type": "Equity", "4. region": "United States" },
                { "1. symbol": "AMZN", "2. name": "Amazon.com, Inc.", "3. type": "Equity", "4. region": "United States" },
                { "1. symbol": "NVDA", "2. name": "NVIDIA Corporation", "3. type": "Equity", "4. region": "United States" }
            ];
            const query = keywords.toUpperCase();
            const matches = common.filter(c => c["1. symbol"].includes(query) || c["2. name"].toUpperCase().includes(query));
            return matches.length > 0 ? matches.map(m => ({
                symbol: m["1. symbol"],
                name: m["2. name"],
                type: m["3. type"],
                region: m["4. region"]
            })) : [];
        }

        const matches = res.data.bestMatches || [];
        return matches.map(match => ({
            symbol: match["1. symbol"],
            name: match["2. name"],
            type: match["3. type"],
            region: match["4. region"]
        }));
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
};

export const fetchStockNews = async (symbol) => {
    if (USE_MOCK_DATA) return getMockNews(symbol);
    try {
        const res = await axios.get(
            `${BASE_URL}?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${API_KEY}`
        );
        
        const feed = res.data.feed || [];
        return feed.slice(0, 5).map(item => ({
            title: item.title,
            url: item.url,
            time: item.time_published,
            summary: item.summary,
            source: item.source,
            sentiment: item.overall_sentiment_label
        }));
    } catch (error) {
        console.error("News error:", error);
        return getMockNews(symbol);
    }
};

export const fetchMarketPerformance = async () => {
    // For heatmap, we use a mix of real sectors or mock data for demo
    return [
        { name: "Technology", change: 2.45, cap: "XLK" },
        { name: "Healthcare", change: -0.85, cap: "XLV" },
        { name: "Financials", change: 1.20, cap: "XLF" },
        { name: "Consumer Disc.", change: 0.45, cap: "XLY" },
        { name: "Communication", change: -1.25, cap: "XLC" },
        { name: "Energy", change: 3.10, cap: "XLE" },
        { name: "Industrials", change: 0.15, cap: "XLI" },
        { name: "Materials", change: -0.40, cap: "XLB" },
        { name: "Real Estate", change: -2.10, cap: "XLRE" },
        { name: "Utilities", change: 0.30, cap: "XLU" }
    ];
};

// --- Mock Data Helpers ---

// Helper for common symbols to names
export const getCompanyName = (symbol) => {
    const names = {
        "AAPL": "Apple Inc.",
        "TSLA": "Tesla, Inc.",
        "MSFT": "Microsoft Corp.",
        "NVDA": "NVIDIA Corporation",
        "GOOGL": "Alphabet Inc.",
        "AMZN": "Amazon.com, Inc.",
        "META": "Meta Platforms, Inc.",
        "NFLX": "Netflix, Inc."
    };
    return names[symbol] || symbol; 
};

function getMockHistory(symbol) {
    const data = [];
    let basePrice = symbol === "TSLA" ? 170 : symbol === "AAPL" ? 180 : 150;
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (30 - i));
        basePrice += (Math.random() - 0.45) * 5;
        data.push({
            date: date.toISOString().split("T")[0],
            price: parseFloat(basePrice.toFixed(2))
        });
    }
    return data;
}

function getMockQuote(symbol) {
    // Generate a semi-stable seed price based on the symbol string
    const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const basePrice = (seed % 300) + 50; // Prices between 50 and 350
    const change = (seed % 100) / 20 - 2.5; // Change between -2.5 and +2.5
    const changePercent = (change / basePrice * 100).toFixed(2);
    
    return {
        symbol: symbol || "AAPL",
        name: getCompanyName(symbol || "AAPL"),
        price: parseFloat(basePrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: `${change >= 0 ? "+" : ""}${changePercent}%`,
        high: parseFloat((basePrice + 1.5).toFixed(2)),
        low: parseFloat((basePrice - 1.2).toFixed(2)),
        volume: 1000000 + (seed * 1000)
    };
}

function getMockNews(symbol) {
    return [
        {
            title: `${symbol} showing strong momentum in pre-market trading`,
            source: "MarketWatch",
            time: "20240413T090000",
            summary: "Investors are closely watching the recent price action as volume increases.",
            url: "#",
            sentiment: "Positive"
        },
        {
            title: "Analysts maintain Buy rating after latest quarter",
            source: "Bloomberg",
            time: "20240413T083000",
            summary: "Revenue growth continues to outpace expectations in core segments.",
            url: "#",
            sentiment: "Positive"
        }
    ];
}