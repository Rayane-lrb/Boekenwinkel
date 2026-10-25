import React from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
}

interface NavbarProps {
  brandName: string;
  items: NavItem[];
}

export const Navbar: React.FC<NavbarProps> = ({brandName, items}) => {
  return (
    <nav className="">
      <div>
        <Link to="/">{brandName}</Link>
      </div>
      <ul>
        {items.map((item, index) =>
        <li key={index}>
          <Link to={item.path}>{item.label}</Link>
        </li>)}
      </ul>
    </nav>
  );
};