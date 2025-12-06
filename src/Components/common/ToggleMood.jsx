// src/Components/common/ToggleMood.jsx
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../ThemeProvider.jsx";

const ToggleMood = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 hover:bg-card transition-colors"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );
};

export default ToggleMood;
