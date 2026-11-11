import { Link } from "react-router-dom";
import CategoryGrid from "../components/CategoryGrid";
import { Container, PageHero, SectionHeading, primaryButton } from "../components/ui";
import usePageTitle from "../hooks/usePageTitle";

const promises = [
  { figure: "$150", label: "Free shipping starts here" },
  { figure: "30 days", label: "To change your mind" },
  { figure: "2 years", label: "Warranty on devices" },
  { figure: "7 days", label: "Support is open" },
];

export default function About() {
  usePageTitle("About Us");

  return (
    <>
      <PageHero eyebrow="About us" title="Electronics, chosen with the specs in view.">
        Veltryn is a shop for people who want the important numbers before the slogan. Phones, laptops, audio, TVs, cameras, watches, and accessories — listed with the details that change a decision.
      </PageHero>
      <Container className="space-y-16 py-14">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-3xl font-extrabold">What we care about</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              A good product page should answer the questions you would ask in a store: how bright is the screen, how long does the battery last, what is the return window, and what will it actually cost after shipping and tax.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              The catalog on this site is sample data stored with the app. Prices, ratings, and stock are here so you can browse, filter, and build a cart in the browser.
            </p>
            <Link to="/shop" className={`${primaryButton} mt-6`}>
              Explore the catalog
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {promises.map((item) => (
              <div key={item.label} className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                <dt className="font-display text-3xl font-extrabold text-aurora">{item.figure}</dt>
                <dd className="mt-2 text-sm font-semibold text-slate-600">{item.label}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <SectionHeading eyebrow="The floor" title="Seven categories, kept tight." />
          <CategoryGrid />
        </section>
      </Container>
    </>
  );
}
