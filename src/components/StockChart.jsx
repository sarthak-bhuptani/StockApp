import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import { useTheme } from "../Service/ThemeContext";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass p-3 rounded-lg border border-border-color shadow-2xl">
                <p className="text-xs text-text-secondary mb-1">{label}</p>
                <p className="text-lg font-bold text-text-primary">
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export default function StockChart({ data }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div className="glass-card flex items-center justify-center h-[400px]">
                <p className="text-slate-400">Select a symbol to view chart</p>
            </div>
        );
    }

    const gridStroke = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    const tickColor = isDark ? "#64748b" : "#94a3b8";

    return (
        <div className="glass-card w-full h-[450px] p-0 overflow-hidden">
            <div className="p-6 border-b border-border-color flex items-center justify-between">
                <div>
                   <h3 className="font-bold text-lg">Performance</h3>
                   <p className="text-xs text-text-secondary">Historical closing prices</p>
                </div>
                <div className="flex gap-2">
                    {["1D", "1W", "1M", "1Y"].map((t) => (
                        <button key={t} className={`text-[10px] font-bold px-2 py-1 rounded ${t === "1M" ? "bg-brand-primary text-white" : "text-text-secondary hover:text-text-primary"}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="w-full h-[360px] p-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(230, 85%, 60%)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(230, 85%, 60%)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: tickColor, fontSize: 10 }}
                            minTickGap={30}
                        />
                        <YAxis 
                            domain={["auto", "auto"]} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: tickColor, fontSize: 10 }}
                            orientation="right"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(230, 85%, 60%)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}