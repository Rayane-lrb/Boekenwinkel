import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface NavItem {
  label: string;
  path: string;
}

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { isLoggedIn, hasRole, logout } = useAuth();
  const brandName = "Library";
  const items: NavItem[] = [
    { label: "Home", path: "/" },
    { label: "Books", path: "/books" },
    { label: "Authors", path: "/authors" },
    ...(hasRole("ROLE_ADMIN") ? [{ label: "Users", path: "/users" }] : []),
    ...(hasRole("ROLE_USER") || hasRole("ROLE_ADMIN")
      ? [{ label: "Reservations", path: "/reservations" }]
      : []),
  ];
  
  return (
    <nav className="mx-auto px-4 py-3 max-w-5xl flex flex-wrap flex-row items-center justify-between md:bg-transparent bg-[#C9A24B]">
      <div>
        <Link to="/" className="text-xl md:text-yellow-500 font-bold text-white">{brandName}</Link>
      </div>
      <button 
      type="button" 
      aria-expanded={open} 
      aria-controls="navbar-links" 
      onClick={() => setOpen((prev) => !prev)}
      className="md:hidden"
      >
        {open ? "Close" : "Menu"}
      </button>
      <ul 
      id="navbar-links"
      className={`${open ? "flex" : "hidden"} text-blue-900 font-semibold md:flex w-full flex-col items-center gap-3 pt-3 md:w-auto md:flex-row md:items-end md:gap-6 md:pt-0`}
      >
        {items.map((item) =>
        <li key={item.label}>
          <Link to={item.path}
           onClick={() => setOpen(false)}
           className="block px-1 py-1 md:border-b-2 md:border-solid md:border-transparent hover:border-[#C9A24B] transition duration-200 ease-in-out">{item.label}</Link>
        </li>)}
        <li>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="block px-1 py-1 md:border-b-2 md:border-solid md:border-transparent hover:border-[#C9A24B] transition duration-200 ease-in-out"
            >
              Log out
            </button>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" onClick={() => setOpen(false)} className="block px-1 py-1 hover:underline">
                Log in
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block px-1 py-1 hover:underline">
                Register
              </Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};
