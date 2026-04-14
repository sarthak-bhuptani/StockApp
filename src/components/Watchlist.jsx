import React, { useState, useEffect } from "react";
import { Star, MoreVertical, TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";
import { fetchStockQuote } from "../Service/stockApi";

export default function Watchlist({ onSelect, watchlist }) {
  const [watchlistData, setWatchlistData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWatchlistData = async () => {
      if (!watchlist || watchlist.length === 0) {
        setWatchlistData([]);
        return;
      }
      
      setLoading(true);
      try {
        const promises = watchlist.map(symbol => fetchStockQuote(symbol));
        const results = await Promise.all(promises);
        setWatchlistData(results);
      } catch (err) {
        console.error("Watchlist data error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlistData();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(loadWatchlistData, 120000);
    return () => clearInterval(interval);
  }, [watchlist]);

  return (
    <div className="glass-card h-full flex flex-col p-0 overflow-hidden">
      <div className="p-6 border-b border-border-color flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2 text-text-primary">
          <Star className="text-brand-primary fill-brand-primary" size={18} />
          Watchlist
        </h3>
        <button className="text-text-secondary hover:text-text-primary transition-colors">
          {loading ? <RefreshCcw size={16} className="animate-spin" /> : <MoreVertical size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 min-h-[300px] max-h-[500px] custom-scrollbar">
        {watchlistData.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => onSelect(stock.symbol)}
            className="group flex items-center justify-between p-4 rounded-xl hover:bg-brand-primary/5 cursor-pointer transition-all border border-transparent hover:border-brand-primary/10 mb-1"
          >
            <div className="flex flex-col">
              <span className="font-black text-text-primary group-hover:text-brand-primary transition-colors tracking-tight">{stock.symbol}</span>
              <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider truncate max-w-[100px]">{stock.name}</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-bold text-text-primary tracking-tight">${stock.price.toFixed(2)}</span>
              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${stock.change >= 0 ? "text-success" : "text-danger"}`}>
                {stock.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(stock.change).toFixed(2)} ({stock.changePercent})
              </span>
            </div>
          </div>
        ))}
        {watchlistData.length === 0 && !loading && (
          <div className="p-10 text-center flex flex-col items-center gap-3">
            <Star size={32} className="text-text-secondary opacity-20" />
            <p className="text-xs text-text-secondary font-medium">Your watchlist is empty.<br/>Star a stock to track it.</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-[var(--sidebar-active-bg)] border-t border-border-color">
        <p className="text-[9px] text-center font-bold text-text-secondary uppercase tracking-[0.2em]">
          End of Watchlist
        </p>
      </div>
    </div>
  );
}
