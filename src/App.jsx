import { useState, useEffect } from "react";
import StockDashboard from "./Page/StockDashboard";
import Layout from "./components/Layout";
import MarketHeatmap from "./components/MarketHeatmap";
import { getCompanyName, searchStocks } from "./Service/stockApi";
import { Search } from "lucide-react";

const INITIAL_SYMBOLS = ["AAPL", "TSLA", "MSFT", "NVDA"];

export default function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [activeSymbol, setActiveSymbol] = useState("AAPL");
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : INITIAL_SYMBOLS;
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (symbol) => {
    setWatchlist(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  // Sections
  const MarketSection = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-color pb-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">Market <span className="text-brand-primary">Intelligence</span></h2>
          <p className="text-sm text-text-secondary font-medium mt-1">Advanced global sector rotation and volatility mapping</p>
        </div>
        <div className="flex gap-2">
            <div className="px-3 py-1 glass rounded-full text-[10px] font-bold text-success border-success/20">NYSE OPEN</div>
            <div className="px-3 py-1 glass rounded-full text-[10px] font-bold text-text-secondary">DELAY 15M</div>
        </div>
      </div>
      
      <MarketHeatmap />
    </div>
  );

  const WatchlistSection = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Detailed Watchlist</h2>
      <div className="glass-card">
        <div className="p-4 border-b border-border-color">
          <p className="text-text-secondary">Manage your tracked symbols</p>
        </div>
        <div className="divide-y divide-border-color">
          {watchlist.map(s => (
            <div key={s} className="p-4 flex justify-between items-center group hover:bg-brand-primary/5 transition-colors">
              <div className="flex flex-col">
                <span className="font-bold text-xl">{s}</span>
                <span className="text-xs text-text-secondary font-medium tracking-wide uppercase">{getCompanyName(s)}</span>
              </div>
              <button 
                onClick={() => toggleWatchlist(s)}
                className="text-danger hover:underline text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remove from Watchlist
              </button>
            </div>
          ))}
          {watchlist.length === 0 && (
            <div className="p-10 text-center text-text-secondary">Your watchlist is empty.</div>
          )}
        </div>
      </div>
    </div>
  );

  const SearchSection = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (e) => {
      e.preventDefault();
      if (!query.trim()) return;
      setSearching(true);
      const res = await searchStocks(query);
      setResults(res);
      setSearching(false);
    };

    const selectStock = (sym) => {
      setActiveSymbol(sym);
      setActiveSection("Dashboard");
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Advanced <span className="text-brand-primary">Search</span></h2>
          <p className="text-sm text-text-secondary font-medium">Global database search with detailed market classifications</p>
        </div>

        <div className="glass-card !p-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-10">
            <div className="flex-1 relative flex items-center group">
              <span className="absolute left-6 text-text-secondary group-focus-within:text-brand-primary transition-colors">
                <Search size={24} />
              </span>
              <input 
                type="text" 
                placeholder="Enter company name, sector, or ticker symbol..." 
                className="w-full pl-16 pr-6 py-5 rounded-2xl bg-surface-base border border-border-color focus:border-brand-primary/50 outline-none transition-all font-bold text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary !px-10 flex items-center gap-2">
              {searching ? "Searching..." : "Search Market"}
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(res => (
              <div 
                key={res.symbol} 
                onClick={() => selectStock(res.symbol)}
                className="glass p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-brand-primary/10 transition-all border border-border-color hover:border-brand-primary/30"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center font-black text-brand-primary text-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                    {res.symbol[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-text-primary group-hover:text-brand-primary transition-colors">{res.symbol}</h4>
                    <p className="text-xs text-text-secondary font-bold uppercase truncate max-w-[200px]">{res.name}</p>
                  </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary border border-border-color px-2 py-1 rounded bg-surface-base">{res.type}</span>
                    <p className="text-[10px] text-text-secondary mt-1 font-medium">{res.region}</p>
                </div>
              </div>
            ))}
            {results.length === 0 && !searching && (
              <div className="col-span-full py-20 text-center text-text-secondary italic font-medium">
                {query ? `No matching assets found for "${query}". Try searching for major tickers like AAPL or TSLA.` : "Enter a search term to find global market assets."}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard": return <StockDashboard watchlist={watchlist} toggleWatchlist={toggleWatchlist} activeSymbol={activeSymbol} setActiveSymbol={setActiveSymbol} />;
      case "Market": return <MarketSection />;
      case "Watchlist": return <WatchlistSection />;
      case "Search": return <SearchSection />;
      default: return <StockDashboard watchlist={watchlist} toggleWatchlist={toggleWatchlist} />;
    }
  };

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderSection()}
    </Layout>
  );
}