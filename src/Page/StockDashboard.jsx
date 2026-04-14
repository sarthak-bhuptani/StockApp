import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, AlertCircle, TrendingUp, TrendingDown, Clock, Star, Share2, MoreHorizontal } from "lucide-react";
import StockChart from "../components/StockChart";
import StockStat from "../components/StockStat";
import Watchlist from "../components/Watchlist";
import StockNews from "../components/StockNews";
import { fetchStockData, fetchStockQuote, searchStocks, fetchMarketPerformance } from "../Service/stockApi";

export default function StockDashboard({ watchlist, toggleWatchlist, activeSymbol, setActiveSymbol }) {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [quote, setQuote] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [marketData, setMarketData] = useState([]);

    const isFavorited = watchlist?.includes(activeSymbol);

    const loadStock = useCallback(async (stockSymbol) => {
        try {
            setLoading(true);
            setError("");
            
            const [historyData, quoteData] = await Promise.all([
                fetchStockData(stockSymbol),
                fetchStockQuote(stockSymbol)
            ]);

            setHistory(historyData);
            setQuote(quoteData);
            setActiveSymbol(stockSymbol); // Update parent state
            setSuggestions([]);
            setInput("");
        } catch (err) {
            setError(err.message || "Failed to load stock data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStock(activeSymbol);
    }, [loadStock, activeSymbol]);

    useEffect(() => {
        const loadMarket = async () => {
            const data = await fetchMarketPerformance();
            setMarketData(data.slice(0, 5)); // Show top 5 sectors
        };
        loadMarket();
    }, []);

    useEffect(() => {
        if (input.length < 2) {
            setSuggestions([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const results = await searchStocks(input);
            setSuggestions(results.slice(0, 5));
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [input]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (input.trim()) {
            loadStock(input.toUpperCase());
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Top Navigation & Global Search Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-border-color pb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-2 text-text-primary">
                        Market <span className="text-brand-primary">Terminal</span>
                    </h1>
                    <div className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-widest opacity-60">
                        <Clock size={12} />
                        <span>Real-time Global Data • GMT -4</span>
                    </div>
                </div>

                <div className="relative w-full max-w-xl">
                    <form onSubmit={handleSearch} className="group flex items-center glass rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all border border-border-color shadow-2xl">
                        <Search className="text-text-secondary mr-4 group-focus-within:text-brand-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Find any stock ticker or company..."
                            className="bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary w-full font-semibold text-lg"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        {loading && <Loader2 className="animate-spin text-brand-primary" size={20} />}
                    </form>

                    {suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-3 glass rounded-2xl border border-border-color shadow-2xl z-[100] overflow-hidden backdrop-blur-2xl">
                            {suggestions.map((s) => (
                                <div
                                    key={s.symbol}
                                    onClick={() => loadStock(s.symbol)}
                                    className="px-5 py-4 hover:bg-brand-primary/10 cursor-pointer flex items-center justify-between group transition-colors border-b border-white/5 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                                            {s.symbol[0]}
                                        </div>
                                        <div>
                                            <div className="font-black text-text-primary group-hover:text-brand-primary transition-colors">{s.symbol}</div>
                                            <div className="text-xs text-text-secondary truncate max-w-[300px]">{s.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] uppercase tracking-widest font-bold text-text-secondary bg-white/5 px-2 py-1 rounded">
                                        {s.type}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger p-6 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2">
                    <AlertCircle size={24} />
                    <span className="font-bold">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Main Content (Wide Column) */}
                <div className="lg:col-span-9 space-y-12">
                    {/* Simplified & Clean Header */}
                    {quote && (
                        <div className="glass-card !bg-transparent border-0 !p-0 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border-color">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-6xl font-black text-text-primary tracking-tighter">
                                            {quote.symbol}
                                        </h2>
                                        <div className="h-8 w-[1px] bg-[var(--border-color)]" />
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleWatchlist(activeSymbol)}
                                                className={`p-3 rounded-2xl transition-all border ${
                                                    isFavorited 
                                                      ? "bg-[#6366f1] border-[#6366f1] text-white shadow-lg shadow-indigo-500/20" 
                                                      : "bg-surface-elevated border-border-color text-text-secondary hover:text-brand-primary hover:border-brand-primary/30"
                                                }`}
                                            >
                                                <Star size={20} fill={isFavorited ? "currentColor" : "none"} />
                                            </button>
                                            <button className="p-3 rounded-2xl bg-surface-elevated border border-border-color text-text-secondary hover:text-text-primary transition-all">
                                                <Share2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest">
                                            NYSE Listed
                                        </span>
                                        <span className="text-text-secondary text-sm font-bold opacity-60">{quote.name}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-6xl font-black text-text-primary tracking-tighter mb-2">
                                        ${quote.price.toFixed(2)}
                                    </div>
                                    <div className={`flex items-center justify-end gap-2 font-black text-xl ${quote.change >= 0 ? "text-success" : "text-danger"}`}>
                                        {quote.change >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                                        {Math.abs(quote.change).toFixed(2)} ({quote.changePercent})
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats & Chart Container */}
                    <div className="space-y-12">
                        {quote && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <StockStat label="Day High" value={quote.high} type="high" change={0.5} />
                                <StockStat label="Day Low" value={quote.low} type="low" change={-0.3} />
                                <StockStat label="Volume" value={quote.volume} type="volume" isCurrency={false} />
                                <StockStat label="Market Cap" value="2.84T" type="mktcap" />
                            </div>
                        )}
                        <div className="glass-card !p-8">
                            <StockChart data={history} />
                        </div>
                    </div>

                    {/* News Feed - Separated Section */}
                    <div className="pt-8 border-t border-border-color">
                        <StockNews symbol={activeSymbol} />
                    </div>
                </div>

                {/* Sidebar (Narrow Column) */}
                <div className="lg:col-span-3 space-y-10 lg:sticky lg:top-10">
                    <Watchlist onSelect={loadStock} watchlist={watchlist} />
                    
                    {/* Market Pulse Sidebar Widget */}
                    <div className="glass-card !p-6">
                        <h3 className="font-black text-sm uppercase tracking-[0.2em] mb-6 text-text-secondary flex items-center gap-3">
                            <TrendingUp size={16} className="text-brand-primary" />
                            Market Pulse
                        </h3>
                        <div className="space-y-4">
                            {marketData.map((sector) => (
                                <div key={sector.name} className="flex items-center justify-between group">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors">{sector.name}</span>
                                        <span className="text-[10px] text-text-secondary font-black uppercase tracking-tighter">{sector.cap}</span>
                                    </div>
                                    <span className={`text-sm font-black ${sector.change >= 0 ? "text-success" : "text-danger"}`}>
                                        {sector.change >= 0 ? "+" : ""}{sector.change}%
                                    </span>
                                </div>
                            ))}
                            <button 
                                onClick={() => setActiveSection("Market")} // Should pass these as props if needed, but App.jsx handles navigation
                                className="w-full mt-4 py-2 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-brand-primary border-t border-white/5 pt-4 transition-colors"
                            >
                                View Global Heatmap
                            </button>
                        </div>
                    </div>

                    <div className="glass-card !p-6">
                         <h3 className="font-black text-sm uppercase tracking-[0.2em] mb-6 text-text-secondary flex items-center gap-3">
                            <Clock size={16} className="text-brand-primary" />
                            Sentiment Analysis
                         </h3>
                         <div className="space-y-8">
                             <div>
                                 <div className="flex justify-between items-end mb-3">
                                     <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">Bullish</span>
                                     <span className="text-success font-black text-lg">65%</span>
                                 </div>
                                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-success w-[65%] shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                                 </div>
                             </div>
                             <div>
                                 <div className="flex justify-between items-end mb-3">
                                     <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">Bearish</span>
                                     <span className="text-danger font-black text-lg">35%</span>
                                 </div>
                                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-danger w-[35%] shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
                                 </div>
                             </div>
                             <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-relaxed italic opacity-70 border-t border-white/5 pt-4">
                                Aggregated from social sentiment and analyst ratings over the last 24 hours.
                             </p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}