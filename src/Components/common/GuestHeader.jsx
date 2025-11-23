// Icons
import { Dumbbell, Menu, X } from "lucide-react";
// Constants
import { header } from "../../constants";
// Components
import ToggleMood from "./ToggleMood";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
// imports
import { Link, useLocation } from "react-router-dom";
gsap.registerPlugin(ScrollTrigger);

const GuestHeader = () => {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".el",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power1.out" }
      );
    }, navRef);

    return () => ctx.revert();
  }, [location.pathname]);
  return (
    <nav
      ref={navRef}
      className={`sticky top-0 w-full h-[70px] transition duration-500 z-50 flex-center`}
    >
      <div className="container flex-between w-[90%] relative">
        <div>
          <Dumbbell className="el" />
        </div>

        <div className="flex md:justify-between justify-end items-center min-w-[60%] gap-4">
          <ul className="menu md:flex justify-between hidden transition">
            {header.map((el) => (
              <Link
                to={el.to}
                key={el.id}
                className="el li text-2xl"
              >
                {el.title}
              </Link>
            ))}
          </ul>

          {open ? (
            <X
              className="md:hidden cursor-pointer el w-6 h-6"
              onClick={() => setOpen((prev) => !prev)}
            />
          ) : (
            <Menu
              className="md:hidden cursor-pointer el w-6 h-6"
              onClick={() => setOpen((prev) => !prev)}
            />
          )}
          {open && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-50">
              <ul className="flex flex-col">
                {header.map((el) => (
                  <li key={el.id}>
                    {el.to.startsWith("#") ? (
                      <a
                        href={el.to}
                        className="block px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {el.title}
                      </a>
                    ) : (
                      <Link
                        to={el.to}
                        className="block px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
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
          <ToggleMood />
        </div>
      </div>
    </nav>
  );
};

export default GuestHeader;

