import React, { useState, useEffect } from "react";
import { fetchMarketPerformance } from "../Service/stockApi";
import { TrendingUp, TrendingDown, Layers } from "lucide-react";

export default function MarketHeatmap() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSectors = async () => {
      const data = await fetchMarketPerformance();
      setSectors(data);
      setLoading(false);
    };
    loadSectors();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="glass-card h-32 bg-white/5" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h3 className="text-xl font-bold flex items-center gap-2">
            <Layers size={22} className="text-brand-primary" />
            Sector Performance
          </h3>
          <p className="text-xs text-text-secondary mt-1 font-medium italic">Relative performance across major S&P 500 sectors</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {sectors.map((sector) => {
          const isPositive = sector.change >= 0;
          return (
            <div 
              key={sector.name}
              className={`glass-card flex flex-col justify-between !p-5 transition-all hover:scale-[1.02] border-l-4 ${
                isPositive ? "border-l-success bg-success/5" : "border-l-danger bg-danger/5"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">{sector.cap}</span>
                {isPositive ? <TrendingUp size={14} className="text-success" /> : <TrendingDown size={14} className="text-danger" />}
              </div>
              
              <div>
                <p className="font-bold text-sm leading-tight text-text-primary mb-1">{sector.name}</p>
                <span className={`text-xl font-black ${isPositive ? "text-success" : "text-danger"}`}>
                   {isPositive ? "+" : ""}{sector.change}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="glass-card !bg-brand-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10 w-full md:w-2/3">
            <h4 className="text-2xl font-black tracking-tight mb-2 text-text-primary">Market Volatility Index <span className="text-brand-primary">(VIX)</span></h4>
            <p className="text-sm text-text-secondary max-w-lg">
                Current market fear index is sitting at <span className="font-bold text-text-primary">14.20 (-2.4%)</span>. 
                Conditions are favored for bullish momentum across Technology and Utilities.
            </p>
          </div>
          <div className="w-full md:w-1/3 h-24 flex items-end gap-1 px-4 relative z-10">
              {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-brand-primary/20 rounded-t-sm" 
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
              ))}
          </div>
          {/* Subtle decoration background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
      </div>
    </div>
  );
}
