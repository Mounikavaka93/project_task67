import { Link } from "react-router-dom";
import { MessageCircle, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Container, PageHero } from "../components/ui";
import usePageTitle from "../hooks/usePageTitle";

const cards = [
  { icon: Truck, title: "Shipping", text: "Free over $150, otherwise $12. Most orders arrive in 2–5 business days.", href: "#shipping" },
  { icon: RotateCcw, title: "Returns", text: "30 days to send an unused item back. Start from the order details you kept.", href: "#returns" },
  { icon: ShieldCheck, title: "Warranty", text: "Two years on devices, one year on accessories, for manufacturing faults.", href: "#warranty" },
  { icon: MessageCircle, title: "Talk to us", text: "Every day, 8 a.m. to 8 p.m. PT. Call, email, or use the contact form.", href: "/contact" },
];

export default function Support() {
  usePageTitle("Customer Support");

  return (
    <>
      <PageHero eyebrow="Customer support" title="Help with shipping, returns, and the gear itself.">
        The short version lives here. The longer answers are in the FAQs, and a person is available every day if you would rather write.
      </PageHero>
      <Container className="space-y-10 py-12">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const className = "rounded-3xl bg-white p-5 ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg";
            const body = (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sand text-aurora">
                  <Icon size={20} />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.text}</p>
              </>
            );
            return card.href.startsWith("/") ? (
              <Link key={card.title} to={card.href} className={className}>
                {body}
              </Link>
            ) : (
              <a key={card.title} href={card.href} className={className}>
                {body}
              </a>
            );
          })}
        </div>

        <section id="shipping" className="scroll-mt-32 rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
          <h2 className="font-display text-2xl font-extrabold">Shipping</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            Orders of $150 or more ship free inside the United States. Below that, shipping is a flat $12. The cart adds an estimated 8% tax so the total is visible before you confirm. Most parcels leave within one business day and arrive in 2–5 business days.
          </p>
        </section>
        <section id="returns" className="scroll-mt-32 rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
          <h2 className="font-display text-2xl font-extrabold">Returns</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            You have 30 days from delivery to return an unused item in its original packaging. Refunds cover the product price. This demo checkout does not take a real payment, so a return here is part of the shopping flow rather than a bank transfer.
          </p>
        </section>
        <section id="warranty" className="scroll-mt-32 rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
          <h2 className="font-display text-2xl font-extrabold">Warranty</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            Devices include a 2-year limited warranty. Accessories include 1 year. Coverage is for manufacturing faults, not for loss, theft, or accidental damage. Write to hello@veltryn.example with the SKU and a short description of the fault.
          </p>
          <Link to="/faq" className="mt-4 inline-block text-sm font-bold text-indigo-700">
            Read the FAQs
          </Link>
        </section>
      </Container>
    </>
  );
}
