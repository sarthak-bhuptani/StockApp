import React from "react";
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Layers, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StockStat({ label, value, type, change, isCurrency = true }) {
  const getIcon = () => {
    switch (type) {
      case "high": return <ArrowUpRight className="text-success" size={16} />;
      case "low": return <ArrowDownRight className="text-danger" size={16} />;
      case "volume": return <Activity className="text-brand-primary" size={16} />;
      default: return <BarChart3 className="text-brand-secondary" size={16} />;
    }
  };

  return (
    <div className="glass-card !p-5 group hover:border-brand-primary/20 transition-all border border-transparent">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-white/5 text-text-secondary">
          {getIcon()}
        </div>
        {change !== undefined && (
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${change >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.12em] opacity-60 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
        <div className="text-xl font-black text-text-primary tracking-tight">
          {isCurrency ? `$${typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : value}` : value.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
