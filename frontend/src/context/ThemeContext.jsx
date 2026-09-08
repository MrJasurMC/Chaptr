import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext(null);
export function ThemeProvider({
  children
}) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("chaptr-theme");
    return saved ? saved === "dark" : true;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("chaptr-theme", dark ? "dark" : "light");
  }, [dark]);
  const toggleTheme = () => setDark(prev => !prev);
  return <ThemeContext.Provider value={{
    dark,
    toggleTheme
  }}>
      {children}
    </ThemeContext.Provider>;
}
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
