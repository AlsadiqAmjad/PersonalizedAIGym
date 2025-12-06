// Icons
import { Dumbbell, Menu, X } from "lucide-react";
// Constants
import { memberHeader } from "../../constants";
// Components
import ToggleMood from "./ToggleMood";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
// imports
import { Link, useLocation, useNavigate } from "react-router-dom";
gsap.registerPlugin(ScrollTrigger);

const MemberHeader = () => {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/");
  };
  useEffect(() => {
    gsap.fromTo(
      navRef.current.querySelectorAll(".el"),
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power1.out" }
    );
  }, [location.pathname]);
    return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav ref={navRef} className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo (click -> main page) */}
          <Link
            to="/"
            className="flex items-center gap-2 group el"
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              The Rec
            </span>
          </Link>

          <div className="flex items-center gap-6 flex-1 justify-end">
            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-8">
              {memberHeader.map((el) => (
                <li key={el.id}>
                  {el.title === "Logout" ? (
                    <button
                      onClick={handleLogout}
                      className="text-base font-medium text-foreground/80 hover:text-primary transition-colors"
                    >
                      {el.title}
                    </button>
                  ) : el.title === "Dashboard" ? (
                    <button
                      onClick={() => navigate("/member/landingPage")}
                      className="text-base font-medium text-foreground/80 hover:text-primary transition-colors"
                    >
                      {el.title}
                    </button>
                  ) : (
                    <Link
                      to={el.to}
                      className="text-base font-medium text-foreground/80 hover:text-primary transition-colors"
                    >
                      {el.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>


            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center ml-4">
              {open ? (
                <X
                  className="cursor-pointer el w-6 h-6"
                  onClick={() => setOpen((prev) => !prev)}
                />
              ) : (
                <Menu
                  className="cursor-pointer el w-6 h-6"
                  onClick={() => setOpen((prev) => !prev)}
                />
              )}
            </div>

            {/* Mobile Menu Dropdown */}
            {open && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-50">
                <ul className="flex flex-col">
                  {memberHeader.map((el) => (
                    <li key={el.id}>
                      {el.title === "Logout" ? (
                        <button
                          onClick={() => {
                            handleLogout();
                            setOpen(false);
                          }}
                          className="block w-full text-left px-6 py-3 text-gray-300 bg-transparent border-0 outline-none"
                        >
                          {el.title}
                        </button>
                      ) : el.title === "Dashboard" ? (
                        <button
                          onClick={() => {
                            navigate("/member/landingPage");
                            setOpen(false);
                          }}
                          className="block w-full text-left px-6 py-3 text-gray-300 bg-transparent border-0 outline-none"
                        >
                          {el.title}
                        </button>
                      ) : (
                        <Link
                          to={el.to}
                          className="block w-full px-6 py-3 text-gray-300 no-underline"
                          onClick={() => setOpen(false)}
                        >
                          {el.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Toggle Mood */}
            {/* <div className="flex-shrink-0">
              <ToggleMood />
            </div> */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MemberHeader;
