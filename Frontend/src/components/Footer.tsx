// components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";

interface FooterItem {
  label: string;
  path: string;
}

export const Footer: React.FC = () => {
  const brandName = "Library";

  return (
    <footer className="bg-[#C9A24B] md:bg-transparent md:border-t-2 md:border-[#C9A24B]">
      <div className="mx-auto px-4 py-3 max-w-5xl flex flex-wrap flex-col items-center justify-between gap-3 md:flex-row">
        <Link to="/" className="text-xl md:text-yellow-500 font-bold text-white">
          {brandName}
        </Link>
        <p className="text-sm text-blue-900">
          © {new Date().getFullYear()} {brandName}
        </p>
      </div>
    </footer>
  );
};