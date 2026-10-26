import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header><Navbar /></header>
      <main className="flex-1 mx-auto w-full max-w-5xl p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}