import { useEffect, useState } from "react";

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('terencio_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('terencio_theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('terencio_theme', 'light');
    }
  }, [isDarkMode]);

  return { isDarkMode, setIsDarkMode };
}
