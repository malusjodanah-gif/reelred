import { useState } from "react";
import {
  House,
  Search,
  Library,
  Sparkles,
  User,
  Menu,
  X,
} from "lucide-react";

import {
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: House,
    },
    {
      name: "Discover",
      path: "/discover",
      icon: Search,
    },
    {
      name: "Collections",
      path: "/collections",
      icon: Library,
    },
    {
      name: "Recommendations",
      path: "/recommendations",
      icon: Sparkles,
    },
  ];

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0f0f0f]/95 backdrop-blur">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
            <span className="text-sm font-bold">
              R
            </span>
          </div>

          <span className="text-xl font-bold">
            Reel<span className="text-red-600">Red</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-red-600/10 text-red-500"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={17} />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Desktop profile */}
        <Link
          to="/profile"
          className="hidden h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition hover:bg-red-600 hover:text-white md:flex"
        >
          <User size={18} />
        </Link>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">

          <Link
            to="/profile"
            onClick={closeMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300"
          >
            <User size={18} />
          </Link>

          <button
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-gray-300"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#111111] px-4 py-3 md:hidden">

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                location.pathname === item.path ||
                (
                  item.path !== "/" &&
                  location.pathname.startsWith(
                    item.path
                  )
                );

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-red-600/10 text-red-500"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}

            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <User size={18} />
              Profile
            </Link>
          </div>

        </div>
      )}
    </nav>
  );
}

export default Navbar;