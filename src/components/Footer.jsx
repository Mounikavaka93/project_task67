import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/catalog";
import { buildShopPath } from "../utils/products";
import Logo from "./Logo";
import { Container } from "./ui";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="3" />
        <path d="M11 10.2v3.6l3.2-1.8z" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    path: <path d="M14 9h2V6h-2c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.2l.8-3H14V9z" fill="currentColor" stroke="none" />,
  },
  {
    label: "X",
    href: "https://x.com",
    path: (
      <path
        d="M5 5.5 10.2 12 5.2 18.5h1.8l4-5.1 3.8 5.1H19l-5.5-7.1L18.6 5.5h-1.8l-3.6 4.7-3.5-4.7H5z"
        fill="currentColor"
        stroke="none"
      />
    ),
  },
];

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="block py-1 text-sm text-slate-300 transition hover:text-white">
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="h-1 bg-gradient-to-r from-aurora via-fuchsia-500 to-cyan-400" />
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            A modern shop for phones, laptops, audio, TVs, cameras, watches, and the accessories that complete them.
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  {social.path}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">Shop</h2>
          <div className="mt-4">
            {CATEGORIES.map((category) => (
              <FooterLink key={category.name} to={buildShopPath({ category: category.name })}>
                {category.name}
              </FooterLink>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">Company</h2>
          <div className="mt-4">
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/support">Customer Support</FooterLink>
            <FooterLink to="/faq">FAQs</FooterLink>
          </div>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">Customer care</h2>
          <div className="mt-4">
            <FooterLink to="/support#shipping">Shipping</FooterLink>
            <FooterLink to="/support#returns">Returns</FooterLink>
            <FooterLink to="/support#warranty">Warranty</FooterLink>
            <FooterLink to="/contact">Email support</FooterLink>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">Every day, 8:00 a.m. – 8:00 p.m. PT</p>
          <a href="tel:+18005550199" className="mt-1 inline-block text-sm font-semibold text-white">
            (800) 555-0199
          </a>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Veltryn. All rights reserved.</p>
        <p>Sample catalog for this demo. Checkout does not take payment.</p>
      </Container>
    </footer>
  );
}
