import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";
import Navbar from "./Navbar";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [pathname, hash]);

  return null;
}

function Toast() {
  const { toast, dismissToast } = useCart();
  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-6 md:justify-end md:px-6">
      <div
        role="status"
        aria-live="polite"
        className="animate-rise pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-2xl"
      >
        <p className="flex-1 leading-relaxed">{toast.message}</p>
        <Link to="/cart" onClick={dismissToast} className="shrink-0 font-bold text-cyan-200">
          View cart
        </Link>
        <button type="button" aria-label="Dismiss notification" onClick={dismissToast} className="text-white/70">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const productPage = pathname.startsWith("/product/");

  return (
    <div className="flex min-h-screen flex-col bg-sand font-sans text-ink antialiased">
      <a
        href="#main"
        className="absolute left-4 top-0 z-[60] -translate-y-full rounded-b-xl bg-white px-4 py-2 text-sm font-bold shadow focus:translate-y-0"
      >
        Skip to content
      </a>
      <ScrollManager />
      <header className="sticky top-0 z-40">
        <AnnouncementBar />
        <Navbar />
      </header>
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <div className={productPage ? "pb-24 md:pb-0" : ""}>
        <Footer />
      </div>
      <Toast />
    </div>
  );
}
