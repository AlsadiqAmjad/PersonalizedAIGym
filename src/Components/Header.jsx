import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider.jsx";
import { Dumbbell, Sun, Moon, Menu, X } from "lucide-react";

const Header = ({ hideNav = false }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Read user role from localStorage to know if user is logged in
  const [userRole] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("userRole");
  });

  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Coaches", href: "#coaches" },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleDashboardClick = () => {
    if (userRole === "coach") {
      navigate("/coach");
    } else if (userRole === "admin") {
      navigate("/admin");
    } else {
      // default to member dashboard
      navigate("/member/landingPage");
    }
    setIsMenuOpen(false);
  };

  const isLoggedIn = !!userRole;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              The Rec
            </span>
          </Link>

          {/* Desktop Navigation (hidden when hideNav = true) */}
          {!hideNav && (
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          )}

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleDashboardClick}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {/* Mobile Navigation (hidden when hideNav = true) */}
              {!hideNav &&
                navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium text-left"
                  >
                    {link.name}
                  </button>
                ))}

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                {isLoggedIn ? (
                  <button
                    onClick={handleDashboardClick}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                <button onClick={toggleTheme} className="p-2 rounded-lg bg-secondary">
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-accent" />
                  ) : (
                    <Moon className="w-5 h-5 text-foreground" />
                  )}
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
