import React from "react";
import { LayoutDashboard, TrendingUp, Bookmark, Search, Settings, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../Service/ThemeContext";

export default function Layout({ children, activeSection, setActiveSection }) {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ icon: Icon, label, id }) => {
    const active = activeSection === id;
    
    return (
      <div 
        onClick={() => {
          setActiveSection(id);
          setIsMobileMenuOpen(false);
        }}
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group ${
          active 
            ? "bg-sidebar-active-bg text-brand-primary font-bold shadow-sm" 
            : "text-text-secondary hover:bg-sidebar-active-bg hover:text-text-primary"
        }`}
      >
        {active && (
          <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-primary rounded-r-full shadow-lg" />
        )}
        
        <Icon size={20} className={`transition-transform duration-300 ${active ? "scale-110 text-brand-primary" : "group-hover:scale-110"}`} />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-surface-base text-text-primary transition-colors duration-500 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col glass border-r border-border-color p-6 z-50">
        <div className="flex items-center gap-4 px-2 mb-10 mt-2">
          <div className="w-11 h-11 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <TrendingUp className="text-white" size={26} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none text-text-primary">
              Stock<span className="text-brand-primary italic">App</span>
            </span>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mt-1">
              Pro Terminal
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
          <NavItem icon={LayoutDashboard} label="Dashboard" id="Dashboard" />
          <NavItem icon={TrendingUp} label="Market" id="Market" />
          <NavItem icon={Bookmark} label="Watchlist" id="Watchlist" />
          <NavItem icon={Search} label="Search" id="Search" />
        </nav>

        <div className="pt-6 border-t border-border-color space-y-3 mt-auto">
          {/* Enhanced & Robust Toggle Button */}
          <button 
            onClick={() => {
              console.log("Toggle Clicked");
              toggleTheme();
            }}
            className="flex items-center justify-between w-full px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 bg-surface-elevated border border-border-color hover:border-brand-primary/30 group shadow-sm active:scale-95"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? 
                <Sun size={20} className="text-brand-primary group-hover:rotate-180 transition-transform duration-700" /> : 
                <Moon size={20} className="text-brand-primary group-hover:-rotate-12 transition-transform" />
              }
              <span className="font-bold text-xs uppercase tracking-wider text-text-secondary group-hover:text-text-primary">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${theme === "light" ? "bg-brand-primary" : "bg-white/10"}`}>
               <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-md transition-all duration-300 ${theme === "light" ? "right-1" : "left-1"}`} />
            </div>
          </button>
          
          <NavItem icon={Settings} label="Settings" id="Settings" />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-6 border-b border-border-color">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center">
            <TrendingUp className="text-white" size={18} />
          </div>
          <span className="font-extrabold tracking-tight text-text-primary">Stock<span className="text-brand-primary italic">App</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary shadow-inner">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-text-primary">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 min-h-screen bg-surface-base relative">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12 relative z-10">
          {children}
        </div>
        {/* Subtle decorative background blur elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -z-1" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px] -z-1" />
      </main>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-surface-base p-6 pt-24 space-y-4 animate-in fade-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-10 border-b border-border-color pb-6">
                <span className="font-black text-2xl uppercase italic">Nav<span className="text-brand-primary">Menu</span></span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-surface-elevated rounded-full">
                    <X size={24} />
                </button>
             </div>
             <NavItem icon={LayoutDashboard} label="Dashboard" id="Dashboard" />
             <NavItem icon={TrendingUp} label="Market" id="Market" />
             <NavItem icon={Bookmark} label="Watchlist" id="Watchlist" />
             <NavItem icon={Search} label="Search" id="Search" />
             <div className="pt-6 border-t border-border-color mt-10">
                <NavItem icon={Settings} label="Settings" id="Settings" />
             </div>
        </div>
      )}
    </div>
  );
}
