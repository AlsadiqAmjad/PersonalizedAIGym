import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, User, Bot, Zap, Shield, Users, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    const baseItems: Array<{ name: string; href: string; icon?: any }> = [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Progress", href: "/progress" },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { name: "Admin Panel", href: "/admin-dashboard", icon: Shield },
      ];
    } else if (user?.role === 'coach') {
      return [
        ...baseItems,
        { name: "Coach Panel", href: "/coach-dashboard", icon: Users },
      ];
    }

    return baseItems;
  };

  const navigation = getNavigationItems();

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-hero p-2 rounded-lg relative">
                <Bot className="h-6 w-6 text-white" />
                <Zap className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                AI Gym Trainer
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-2 ${
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;