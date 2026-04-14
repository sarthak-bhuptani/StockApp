import React, { createContext, useContext, useState, useLayoutEffect } from "react";

const ThemeContext = createContext();

const THEMES = {
  dark: {
    "--surface-base": "hsl(220, 25%, 10%)",
    "--surface-elevated": "hsl(220, 25%, 15%)",
    "--surface-glass": "hsla(220, 25%, 15%, 0.7)",
    "--text-primary": "hsl(0, 0%, 100%)",
    "--text-secondary: ": "hsl(215, 20%, 65%)",
    "--border-color": "hsla(0, 0%, 100%, 0.1)",
    "--sidebar-active-bg": "hsla(230, 85%, 60%, 0.12)",
    "color-scheme": "dark"
  },
  light: {
    "--surface-base": "hsl(210, 40%, 98%)",
    "--surface-elevated": "hsl(0, 0%, 100%)",
    "--surface-glass": "hsla(0, 0%, 100%, 0.85)",
    "--text-primary": "hsl(220, 40%, 10%)",
    "--text-secondary": "hsl(215, 15%, 35%)",
    "--border-color": "hsla(220, 40%, 10%, 0.1)",
    "--sidebar-active-bg": "hsla(230, 85%, 60%, 0.08)",
    "color-scheme": "light"
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useLayoutEffect(() => {
    const root = document.documentElement;
    const colors = THEMES[theme];
    
    // Forced Variable Injection (Bulletproof)
    Object.entries(colors).forEach(([property, value]) => {
      if (property === "color-scheme") {
        root.style.colorScheme = value;
      } else {
        root.style.setProperty(property, value);
      }
    });

    // Mirror with classes for any existing CSS that relies on them
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    
    localStorage.setItem("theme", theme);
    console.log(`[ThemeEngine] FORCED ${theme.toUpperCase()} variables to document root.`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
