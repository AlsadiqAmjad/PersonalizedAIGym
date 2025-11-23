import { useState } from "react";
import { Calendar, Layout, Activity, BarChart3 } from "lucide-react";

const Menu = () => {
  const [active, setActive] = useState("Today's Plan"); // default active menu

  const menus = [
    { name: "Today's Plan", icon: Calendar },
    { name: "Calender", icon: Calendar },
    { name: "Workout", icon: Activity },
    { name: "Overview", icon: BarChart3 },
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
      <div className="flex justify-around gap-2">
        {menus.map((menu) => {
          const Icon = menu.icon;
          return (
            <button
              key={menu.name}
              onClick={() => setActive(menu.name)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold text-sm ${
                active === menu.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-650"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{menu.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
