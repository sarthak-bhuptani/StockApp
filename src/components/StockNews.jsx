import React, { useState, useEffect } from "react";
import { Newspaper, ExternalLink, Clock, Sparkles, BrainCircuit, TrendingUp, TrendingDown } from "lucide-react";
import { fetchStockNews } from "../Service/stockApi";

export default function StockNews({ symbol }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const data = await fetchStockNews(symbol);
      setNews(data);
      setLoading(false);
    };
    if (symbol) loadNews();
  }, [symbol]);

  const generateMarketInsight = (newsData) => {
    if (!newsData || !newsData.length) {
      return { 
        lead: "Intelligence pending for this ticker.", 
        detail: "Our market engine is currently scanning global networks but lacks sufficient recent data to provide a verified AI summary.", 
        overall: "Neutral" 
      };
    }
    
    const sentiments = newsData.map(n => n.sentiment);
    const positive = sentiments.filter(s => s === "Bullish" || s === "Positive").length;
    const neutral = sentiments.filter(s => s === "Neutral").length;
    const negative = sentiments.filter(s => s === "Bearish" || s === "Somewhat Bearish").length;
    
    let lead = "";
    if (positive > negative) lead = `Bullish momentum is currently dominant for ${symbol}.`;
    else if (negative > positive) lead = `Bearish pressure is increasing for ${symbol}.`;
    else lead = `Market outlook for ${symbol} remains balanced and cautious.`;

    const detail = `Sentiment analysis across ${newsData.length} recent news sources shows a ${Math.round((positive/newsData.length)*100)}% positive outlook toward the ticker. Investors are reacting primarily to recent volatility and exchange reports.`;
    
    return { lead, detail, overall: positive > negative ? "Bullish" : negative > positive ? "Bearish" : "Neutral" };
  };

  if (loading) return (
    <div className="glass-card animate-pulse h-64 flex items-center justify-center">
       <div className="text-text-secondary">Scanning global news networks...</div>
    </div>
  );

  const insight = generateMarketInsight(news);

  return (
    <div className="space-y-8">
      {/* 1. AI Sentiment Insight (Simple UI) */}
      <div className="glass-card !bg-brand-primary/5 !p-4 flex items-center justify-between gap-4 border-brand-primary/10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-brand-primary shadow-lg shadow-brand-primary/20 text-white">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary leading-tight">{insight.lead}</h4>
            <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">{insight.detail}</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-surface-base border ${
          insight.overall === "Bullish" ? "text-success border-success/30" : 
          insight.overall === "Bearish" ? "text-danger border-danger/30" : "text-text-secondary border-white/10"
        }`}>
          {insight.overall} Sentiment
        </div>
      </div>

      {/* 2. News Feed Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Newspaper size={20} className="text-brand-primary" />
            Market Intelligence
          </h3>
          <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
            {symbol} News Feed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map((item, i) => (
            <a 
              key={i} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-card !p-5 group hover:border-brand-primary/30 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[9px] font-black px-2 py-1 rounded bg-brand-primary/10 text-brand-primary uppercase tracking-wider">
                  {item.source}
                </span>
                <span className={`text-[9px] font-black px-2 py-1 rounded uppercase bg-white/5 ${
                  item.sentiment === "Bullish" || item.sentiment === "Positive" ? "text-success" : "text-text-secondary"
                }`}>
                  {item.sentiment}
                </span>
              </div>
              
              <h4 className="font-bold text-sm leading-snug group-hover:text-brand-primary transition-colors line-clamp-2 mb-2">
                {item.title}
              </h4>
              
              <p className="text-xs text-text-secondary line-clamp-2 mb-6">
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-color/50">
                <div className="flex items-center gap-2 text-[10px] text-text-secondary font-medium">
                  <Clock size={12} />
                  <span>Latest Update</span>
                </div>
                <ExternalLink size={12} className="text-text-secondary group-hover:text-brand-primary" />
              </div>
            </a>
          ))}

          {news.length === 0 && (
            <div className="col-span-full glass-card text-center py-20 text-text-secondary italic">
              No recent news headlines found for {symbol}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
