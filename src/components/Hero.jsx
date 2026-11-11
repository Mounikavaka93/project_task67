import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getProductById } from "../data/catalog";
import { buildShopPath } from "../utils/products";
import { darkGhostButton, lightButton } from "./ui";
import OrbitStage from "./OrbitStage";

const SLIDES = [
  {
    productId: 1,
    kicker: "New arrival",
    title: "A flagship that keeps up with your day.",
    text: "A bright 120Hz display, a serious camera, and battery life that lasts from the commute to late night.",
    cta: "Shop the Pulse X1",
    href: "/product/1",
  },
  {
    productId: 4,
    kicker: "Laptops",
    title: "Sixteen inches of room for real work.",
    text: "A color-true display, all-day battery, and enough power for creative tools and a dozen open tabs.",
    cta: "Shop laptops",
    href: buildShopPath({ category: "Laptops" }),
  },
  {
    productId: 7,
    kicker: "Headphones",
    title: "Turn the noise down. Leave the music up.",
    text: "Adaptive noise control, plush cushions, and a seasonal markdown on our best-selling pair.",
    cta: "Shop headphones",
    href: buildShopPath({ category: "Headphones" }),
  },
];

export default function Hero() {
  const slides = SLIDES.map((slide) => ({ ...slide, product: getProductById(slide.productId) })).filter(
    (slide) => slide.product,
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const startX = useRef(0);
  const reduceMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (paused || reduceMotion.current || slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, cycle, slides.length]);

  const go = (next) => {
    const total = slides.length;
    setIndex(((next % total) + total) % total);
    setCycle((value) => value + 1);
  };

  const slide = slides[index];
  if (!slide) return null;

  return (
    <section
      className="relative overflow-hidden bg-ink text-white"
      aria-roledescription="carousel"
      aria-label="Promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onTouchStart={(event) => {
        startX.current = event.changedTouches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const delta = event.changedTouches[0].clientX - startX.current;
        if (delta > 50) go(index - 1);
        if (delta < -50) go(index + 1);
      }}
    >
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <div className="animate-drift pointer-events-none absolute -left-16 top-8 h-72 w-72 rounded-full bg-aurora/50 blur-3xl" />
      <div className="animate-drift pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl [animation-delay:-5s]" />
      <div className="animate-drift pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl [animation-delay:-9s]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-16 lg:px-8 lg:py-20">
        <div key={slide.product.id} className="animate-rise" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">{slide.kicker}</p>
          <h1 className="mt-3 max-w-xl text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">{slide.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={slide.href} className={lightButton}>
              {slide.cta}
              <ArrowRight size={16} />
            </Link>
            <Link to="/shop" className={darkGhostButton}>
              Browse the catalog
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <OrbitStage />
          <p className="mt-1 text-center text-xs font-semibold tracking-wide text-white/60">
            <span className="md:hidden">Tap a product to open it</span>
            <span className="hidden md:inline">Move across the products to tilt the stage</span>
          </p>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-wrap items-center gap-4 px-4 pb-20 sm:px-6 lg:px-8">
        <button type="button" aria-label="Previous promotion" onClick={() => go(index - 1)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition hover:bg-white/20">
          <ChevronLeft size={18} />
        </button>
        <button type="button" aria-label="Next promotion" onClick={() => go(index + 1)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition hover:bg-white/20">
          <ChevronRight size={18} />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose a promotion">
          {slides.map((item, itemIndex) => (
            <button
              key={item.productId}
              type="button"
              role="tab"
              aria-selected={itemIndex === index}
              aria-label={`Show promotion ${itemIndex + 1}`}
              onClick={() => go(itemIndex)}
              className={`h-2.5 rounded-full transition-all ${itemIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/35 hover:bg-white/60"}`}
            />
          ))}
        </div>
        <div className="h-1 w-28 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
          <div key={`${index}-${cycle}`} className={`h-full w-full bg-white animate-progress ${paused ? "is-paused" : ""}`} />
        </div>
        <p className="text-sm font-semibold text-white/70">
          {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
