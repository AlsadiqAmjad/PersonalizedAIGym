import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Activity, BarChart3 } from "lucide-react";

const Menu = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Today's Plan");

  const menus = [
    { name: "Today's Plan", icon: Calendar, path: "/member/landingPage" },
    { name: "Calendar", icon: Calendar, path: "/member/schedule" },
    { name: "Workout", icon: Activity, path: "/member/fitnessGoal" },
    { name: "Overview", icon: BarChart3, path: "/member/profile" },
  ];

  const handleClick = (menu) => {
    setActive(menu.name);

    if (menu.name === "Calendar") {
      navigate("/member/schedule", { state: { mode: "edit" } });
    } else if (menu.name === "Workout") {
      navigate("/member/fitnessGoal", { state: { mode: "edit" } });
    } else {
      navigate(menu.path);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-lg p-4 border border-border">
      <div className="flex justify-around gap-2">
        {menus.map((menu) => {
          const Icon = menu.icon;
          return (
            <button
              key={menu.name}
              onClick={() => handleClick(menu)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold text-sm ${
                active === menu.name
                  ? "bg-blue-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
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
