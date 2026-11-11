import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import CategoryGrid from "../components/CategoryGrid";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { Container, SectionHeading, ghostButton, lightButton, primaryButton } from "../components/ui";
import { getProductById, products } from "../data/catalog";
import usePageTitle from "../hooks/usePageTitle";
import { buildShopPath, discountPercent } from "../utils/products";

const benefits = [
  {
    icon: Truck,
    title: "Free over $150",
    text: "Smaller orders ship for a flat $12. The cart shows exactly how close you are.",
  },
  {
    icon: RotateCcw,
    title: "30 days to decide",
    text: "If it is not the right fit, start a return within 30 days of delivery.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty on the box",
    text: "Two years on devices and one year on accessories, for manufacturing faults.",
  },
  {
    icon: Headphones,
    title: "Support that picks up",
    text: "Talk to a person every day from 8 a.m. to 8 p.m. Pacific.",
  },
];

const notes = [
  {
    title: "The spec list matched the box",
    text: "I compared three laptops on the same page, and the one that arrived had every port and panel I had checked.",
    meta: "Verified buyer · Laptops",
  },
  {
    title: "Quiet enough for the commute",
    text: "Noise control holds up on the train, and the battery got through a full week of ordinary days.",
    meta: "Verified buyer · Headphones",
  },
  {
    title: "The total was clear first",
    text: "Shipping, tax, and the discount were on the cart before I confirmed anything. No surprises in the number.",
    meta: "Verified buyer · Accessories",
  },
];

function TrustBar() {
  const items = [
    { icon: Truck, label: "Free shipping over $150" },
    { icon: RotateCcw, label: "30-day returns" },
    { icon: ShieldCheck, label: "2-year device warranty" },
    { icon: Clock, label: "Support 7 days a week" },
  ];

  return (
    <ul className="grid grid-cols-2 gap-3 rounded-[1.75rem] bg-white p-4 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 md:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.label} className="flex items-center gap-3 rounded-2xl px-2 py-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sand text-aurora">
              <Icon size={18} />
            </span>
            <span className="text-sm font-semibold leading-snug">{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email to join the list.");
      setDone(false);
      return;
    }
    setError("");
    setDone(true);
  };

  return (
    <section>
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-white sm:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">The list</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Launch days and weekend offers.</h2>
              <p className="mt-3 max-w-lg text-slate-300">
                One note when something worth owning lands, and the occasional price drop. No daily noise.
              </p>
            </div>
            {done ? (
              <p className="rounded-2xl bg-white/10 px-5 py-4 font-semibold" role="status">
                You are on the list. We will save this interest for the next drop.
              </p>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  className="h-12 w-full min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-5 text-sm text-white placeholder:text-slate-400"
                />
                <button type="submit" className={`${lightButton} shrink-0`}>
                  Join
                </button>
                {error && (
                  <p className="basis-full text-sm text-rose-200" role="alert">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function Home() {
  usePageTitle("");
  const featured = [...products].sort((a, b) => b.rating - a.rating || a.id - b.id).slice(0, 8);
  const deals = [...products].sort((a, b) => discountPercent(b) - discountPercent(a) || a.price - b.price).slice(0, 4);
  const audio = getProductById(7);

  return (
    <>
      <Hero />
      <div className="relative z-10 -mt-10">
        <Container>
          <TrustBar />
        </Container>
      </div>

      <div className="space-y-16 py-14 sm:space-y-20 sm:py-16">
        <section>
          <Container>
            <SectionHeading
              eyebrow="Browse"
              title="Shop by category"
              action={
                <Link to="/shop" className={ghostButton}>
                  View catalog
                </Link>
              }
            />
            <CategoryGrid />
          </Container>
        </section>

        <section>
          <Container>
            <SectionHeading
              eyebrow="Top rated"
              title="Electronics people keep."
              action={
                <Link to="/shop" className={ghostButton}>
                  Shop all
                </Link>
              }
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {featured.map((product, index) => (
                <ProductCard key={product.id} product={product} style={{ animationDelay: `${index * 40}ms` }} />
              ))}
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <div className="grid items-stretch gap-4 lg:grid-cols-2">
              <Link
                to={buildShopPath({ category: "Laptops" })}
                className="group flex h-full min-h-72 flex-col justify-end rounded-[2rem] bg-ink p-8 text-white"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Work smarter</p>
                <h2 className="mt-3 max-w-md font-display text-3xl font-extrabold sm:text-4xl">
                  Laptops for the studio and the commute.
                </h2>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                  Shop laptops
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                to={buildShopPath({ category: "Headphones" })}
                className="group relative flex h-full min-h-72 flex-col overflow-hidden rounded-[2rem] text-white"
              >
                <img
                  src={audio?.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
                <div className="relative mt-auto p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Audio week</p>
                  <h2 className="mt-3 max-w-sm font-display text-3xl font-extrabold">Headphones, marked down.</h2>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                    Shop headphones
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </div>
          </Container>
        </section>

        <section id="offers" className="scroll-mt-32">
          <Container>
            <SectionHeading
              eyebrow="This week"
              title="The sharpest discounts."
              action={
                <Link to={buildShopPath({ sort: "discount" })} className={ghostButton}>
                  All deals
                </Link>
              }
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {deals.map((product, index) => (
                <ProductCard key={product.id} product={product} style={{ animationDelay: `${index * 50}ms` }} />
              ))}
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <SectionHeading eyebrow="Why Veltryn" title="Clear specs. Honest totals." />
            <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <article key={benefit.title} className="flex h-full flex-col rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sand text-aurora">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-4 font-display text-xl font-bold">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{benefit.text}</p>
                  </article>
                );
              })}
            </div>
            <div className="mt-4 grid items-stretch gap-4 lg:grid-cols-3">
              {notes.map((note) => (
                <blockquote key={note.title} className="flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                  <p className="font-display text-xl font-bold">{note.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{note.text}</p>
                  <footer className="mt-auto pt-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{note.meta}</footer>
                </blockquote>
              ))}
            </div>
          </Container>
        </section>

        <Newsletter />

        <section className="pb-4">
          <Container className="text-center">
            <Link to="/shop" className={primaryButton}>
              Start shopping
              <ArrowRight size={16} />
            </Link>
          </Container>
        </section>
      </div>
    </>
  );
}
