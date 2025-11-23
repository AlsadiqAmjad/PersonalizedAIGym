// Icons
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const ToggleMood = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true; // Default to dark mode
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (darkMode) {
      html.classList.add("dark");
      body.classList.add("dark");
    } else {
      html.classList.remove("dark");
      body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div
      className="hover:cursor-pointer p-2 rounded-full transition-colors duration-200"
      onClick={() => setDarkMode(!darkMode)}
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? (
        <Sun className="el w-6 h-6 text-yellow-400 hover:text-yellow-300" />
      ) : (
        <Moon className="el w-6 h-6 text-gray-400 hover:text-gray-300" />
      )}
    </div>
  );
};

export default ToggleMood;

