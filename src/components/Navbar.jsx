import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown, Menu, Search, ShoppingCart, X } from "lucide-react";
import { CATEGORIES } from "../data/catalog";
import { buildShopPath } from "../utils/products";
import { useCart } from "../context/CartContext";
import CategoryIcon from "./CategoryIcon";
import Logo from "./Logo";
import { Container } from "./ui";

export default function Navbar() {
  const { count } = useCart();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [params] = useSearchParams();
  const [term, setTerm] = useState(params.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    setTerm(params.get("q") ?? "");
  }, [params]);

  useEffect(() => {
    setOpen(false);
    setCatOpen(false);
  }, [pathname, search]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setCatOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dealsActive = pathname === "/shop" && params.get("sort") === "discount";
  const shopActive = !dealsActive && (pathname === "/shop" || pathname.startsWith("/product"));

  const itemClass = (active) =>
    `inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
      active ? "bg-ink text-white" : "text-slate-600 hover:bg-sand hover:text-ink"
    }`;

  const onSearch = (event) => {
    event.preventDefault();
    navigate(buildShopPath({ query: term.trim() }));
  };

  return (
    <div className="border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <Container className="flex h-16 items-center gap-3 sm:h-[4.5rem]">
        <Logo />
        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 lg:flex">
          <Link to="/" className={itemClass(pathname === "/")}>
            Home
          </Link>
          <Link to="/shop" className={itemClass(shopActive)}>
            Shop
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
            onFocus={() => setCatOpen(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setCatOpen(false);
            }}
          >
            <button type="button" className={itemClass(false)} aria-expanded={catOpen} aria-haspopup="true">
              Categories
              <ChevronDown size={16} className={`transition ${catOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`absolute left-0 top-full z-50 w-72 pt-3 transition ${catOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
              <div className="rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.name}
                    to={buildShopPath({ category: category.name })}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-sand"
                  >
                    <span className={`grid h-8 w-8 place-items-center rounded-lg ${category.tint}`}>
                      <CategoryIcon name={category.name} size={16} />
                    </span>
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link to={buildShopPath({ sort: "discount" })} className={itemClass(dealsActive)}>
            Deals
          </Link>
          <Link to="/support" className={itemClass(pathname === "/support")}>
            Support
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={onSearch} role="search" className="hidden lg:block">
            <label htmlFor="nav-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                id="nav-search"
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Search electronics"
                className="h-11 w-56 rounded-full border border-slate-200 bg-sand py-0 pl-9 pr-4 text-sm transition focus:border-aurora focus:bg-white lg:w-72"
              />
            </div>
          </form>
          <Link
            to="/cart"
            aria-label={`Shopping cart, ${count} ${count === 1 ? "item" : "items"}`}
            className="relative grid h-11 w-11 place-items-center rounded-full bg-sand text-ink transition hover:bg-mist"
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-[11px] font-bold leading-none text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full bg-sand lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>

      <div className={`overflow-hidden border-t border-slate-200 bg-white transition-[max-height] duration-300 lg:hidden ${open ? "max-h-[80vh]" : "max-h-0 border-t-0"}`}>
        <div className="max-h-[80vh] overflow-y-auto px-4 py-4">
          <form onSubmit={onSearch} role="search">
            <label htmlFor="mobile-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                id="mobile-search"
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Search electronics"
                className="w-full rounded-2xl border border-slate-200 bg-sand py-3 pl-10 pr-4 text-sm"
              />
            </div>
          </form>
          <div className="mt-4 grid gap-1">
            <Link to="/" className="rounded-xl px-3 py-3 font-semibold hover:bg-sand">Home</Link>
            <Link to="/shop" className="rounded-xl px-3 py-3 font-semibold hover:bg-sand">Shop</Link>
            <Link to={buildShopPath({ sort: "discount" })} className="rounded-xl px-3 py-3 font-semibold hover:bg-sand">Deals</Link>
            <Link to="/support" className="rounded-xl px-3 py-3 font-semibold hover:bg-sand">Support</Link>
          </div>
          <p className="mt-5 px-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Categories</p>
          <div className="mt-2 grid gap-1">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={buildShopPath({ category: category.name })}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold hover:bg-sand"
              >
                <CategoryIcon name={category.name} size={18} />
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
