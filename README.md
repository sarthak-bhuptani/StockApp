# 📈 StockApp - Professional Market Terminal

A modern, high-performance Stock Tracking Dashboard built with **React**, **Vite**, and **Tailwind CSS v4**. This application offers an institutional-grade trading experience with real-time data, AI-driven sentiment insights, and advanced global market searching.

## 🚀 Key Features

*   **📊 Dynamic Market Dashboard**: Interactive charts powered by Recharts with live price tracking for major symbols.
*   **🧠 AI-Powered Sentiment Engine**: Proprietary logic that analyzes global news sentiment to provide a "Market Mood" summary.
*   **🔍 Advanced Global Search**: Search for any stock or company globally with a robust failsafe fallback system.
*   **🔥 Sector Intelligence**: Visual heatmap of S&P 500 sectors to track rotation and market volatility.
*   **⭐ Personal Watchlist**: Track your favorite tickers with real-time price updates and full company name display.
*   **🌓 Adaptive Dark Mode**: Premium Midnight Dark mode with seamless light-mode switching using HSL Tailored color tokens.

## 🛠️ Tech Stack

*   **Frontend**: React 19 (Hooks/Functional Architecture)
*   **Build Tool**: Vite 8 (Ultra-fast HMR and bundling)
*   **Styling**: Tailwind CSS v4 (Modern CSS-first approach with @utility support)
*   **Data API**: Alpha Vantage (Global Quote, Symbol Search, News Sentiment)
*   **Icons**: Lucide React
*   **Charts**: Recharts

## 📥 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sarthak-bhuptani/StockApp.git
   cd StockApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set your API Key**:
   Open `src/Service/stockApi.js` and update the `API_KEY` constant with your free [Alpha Vantage API Key](https://www.alphavantage.co/support/#api-key).

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Sarthak Bhuptani](https://github.com/sarthak-bhuptani)
