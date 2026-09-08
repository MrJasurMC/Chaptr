import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PiBookOpenTextDuotone } from "react-icons/pi";
import { LuSun, LuMoon, LuLogOut, LuShieldCheck, LuMenu, LuX, LuHeart } from "react-icons/lu";
import { useTheme } from "../context/ThemeContext";
import { logout } from "../store/authSlice";
import SearchBox from "./SearchBox";
const Navbar = () => {
  const {
    dark,
    toggleTheme
  } = useTheme();
  const {
    user
  } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const initials = user?.name ? user.name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase() : "";
  return <nav className="sticky top-0 z-30 backdrop-blur border-b border-paper-border dark:border-ink-border bg-paper-bg/85 dark:bg-ink-bg/85">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <PiBookOpenTextDuotone className="text-2xl text-gold" aria-hidden="true" />
          <span className="font-serif text-xl tracking-wide">Chaptr</span>
        </Link>

        <div className="hidden sm:flex items-center gap-8 text-sm text-paper-sub dark:text-ink-sub">
          {!isAdminRoute && <>
              <Link to="/" className="hover:text-gold transition">Home</Link>
              <Link to="/about" className="hover:text-gold transition">About</Link>
              <Link to="/categories" className="hover:text-gold transition">Browse books</Link>
              <Link to="/for-you" className="hover:text-gold transition">For You</Link>
            </>}
          {user?.role === "admin" && <Link to="/admin" className="flex items-center gap-1.5 hover:text-gold transition">
              <LuShieldCheck size={15} aria-hidden="true" /> Admin
            </Link>}
        </div>

        <div className="flex items-center gap-3">
          {!isAdminRoute && <div className="hidden sm:block"><SearchBox /></div>}

          {user && <Link to="/profile" className="hidden md:flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-paper-border dark:border-ink-border hover:border-gold transition">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium bg-gold text-ink-bg shrink-0" aria-hidden="true">
                {initials}
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-medium">{user.name}</span>
                {user.role === "admin" && <span className="text-[10px] uppercase tracking-wide text-gold">Admin</span>}
              </div>
            </Link>}

          {!user && <div className="hidden sm:flex items-center gap-2 text-sm">
              <Link to="/login" className="px-3 py-1.5 rounded-full border border-paper-border dark:border-ink-border hover:border-gold transition">
                Sign in
              </Link>
              <Link to="/register" className="px-3 py-1.5 rounded-full bg-gold text-ink-bg hover:brightness-110 transition">
                Register
              </Link>
            </div>}

          {user && <button onClick={handleLogout} className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border border-paper-border dark:border-ink-border hover:text-gold transition" aria-label="Log out">
              <LuLogOut size={16} />
            </button>}

          <button onClick={toggleTheme} className="w-9 h-9 rounded-full flex items-center justify-center border border-paper-border dark:border-ink-border hover:text-gold transition" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? <LuSun size={16} /> : <LuMoon size={16} />}
          </button>

          <button onClick={() => setMenuOpen(true)} className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center border border-paper-border dark:border-ink-border hover:text-gold transition" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu">
            <LuMenu size={18} />
          </button>
        </div>
      </div>

      {menuOpen && <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" className="sm:hidden fixed inset-0 z-40 bg-paper-bg dark:bg-ink-bg">
          <div className="flex items-center justify-between px-6 py-4 border-b border-paper-border dark:border-ink-border">
            <Link to="/" className="flex items-center gap-2">
              <PiBookOpenTextDuotone className="text-2xl text-gold" aria-hidden="true" />
              <span className="font-serif text-xl tracking-wide">Chaptr</span>
            </Link>
            <button onClick={() => setMenuOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center border border-paper-border dark:border-ink-border" aria-label="Close menu">
              <LuX size={18} />
            </button>
          </div>

          <div className="px-6 py-6 flex flex-col gap-1 text-base overflow-y-auto h-[calc(100vh-73px)]">
            {!isAdminRoute && <>
                <Link to="/" className="py-3 border-b border-paper-border dark:border-ink-border">Home</Link>
                <Link to="/about" className="py-3 border-b border-paper-border dark:border-ink-border">About</Link>
                <Link to="/categories" className="py-3 border-b border-paper-border dark:border-ink-border">Browse books</Link>
                <Link to="/for-you" className="py-3 border-b border-paper-border dark:border-ink-border flex items-center gap-2">
                  <LuHeart size={16} className="text-gold" aria-hidden="true" /> For You
                </Link>
              </>}
            {user?.role === "admin" && <Link to="/admin" className="py-3 border-b border-paper-border dark:border-ink-border flex items-center gap-2">
                <LuShieldCheck size={16} className="text-gold" aria-hidden="true" /> Admin
              </Link>}

            {user ? <>
                <Link to="/profile" className="py-3 border-b border-paper-border dark:border-ink-border">
                  My profile
                </Link>
                <button onClick={handleLogout} className="py-3 text-left text-red-500">
                  Log out
                </button>
              </> : <div className="flex flex-col gap-3 mt-4">
                <Link to="/login" className="text-center px-4 py-3 rounded-md border border-paper-border dark:border-ink-border">
                  Sign in
                </Link>
                <Link to="/register" className="text-center px-4 py-3 rounded-md bg-gold text-ink-bg font-medium">
                  Register
                </Link>
              </div>}
          </div>
        </div>}
    </nav>;
};
export default Navbar;
