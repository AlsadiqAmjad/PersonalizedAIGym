// Icons
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const ToggleMood = () => {
  // Initialize from localStorage, default to true (dark mode)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // Save to localStorage whenever darkMode changes
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    
    const body = document.body;
    const html = document.documentElement;
    
    if (darkMode) {
      body.classList.add("dark");
      html.classList.add("dark");
    } else {
      body.classList.remove("dark");
      html.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className="hover:cursor-pointer transition-opacity hover:opacity-70"
      onClick={toggleMode}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="el w-6 h-6 text-yellow-400" />
      ) : (
        <Moon className="el w-6 h-6 text-gray-300" />
      )}
    </div>
  );
};

export default ToggleMood;
