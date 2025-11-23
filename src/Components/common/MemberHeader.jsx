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
    <nav
      ref={navRef}
      className={`sticky top-0 w-full h-[70px] transition duration-500 z-50 flex-center`}
    >
      <div className="container flex-between w-[90%] relative">
        <div className="flex-shrink-0">
          <Dumbbell className="el" />
        </div>

        <div className="flex items-center gap-6 flex-1 justify-end">
          {/* Desktop Menu */}
          <ul className="menu md:flex hidden items-center gap-6">
            {memberHeader.map((el) => (
              <li key={el.id} className="flex-shrink-0">
                {el.title === "Logout" ? (
                  <button
                    onClick={handleLogout}
                    className="el text-2xl text-gray-300 border-0 outline-none focus:outline-none focus:border-0 hover:border-0 active:border-0 bg-transparent cursor-pointer"
                  >
                    {el.title}
                  </button>
                ) : el.title === "Dashboard" ? (
                  <button
                    onClick={() => navigate("/member/landingPage")}
                    className="el text-2xl text-gray-300 border-0 outline-none focus:outline-none focus:border-0 hover:border-0 active:border-0 bg-transparent cursor-pointer"
                  >
                    {el.title}
                  </button>
                ) : (
                  <Link 
                    to={el.to} 
                    className="el text-2xl text-gray-300 no-underline"
                  >
                    {el.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex-shrink-0">
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
                        className="block px-6 py-3 text-gray-300 no-underline"
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
          <div className="flex-shrink-0">
            <ToggleMood />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MemberHeader;
