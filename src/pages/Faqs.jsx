import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container, PageHero } from "../components/ui";
import usePageTitle from "../hooks/usePageTitle";

const FAQS = [
  {
    id: "faq-shipping",
    question: "How fast is shipping?",
    answer:
      "Most orders leave within one business day and arrive in 2–5 business days inside the United States. Shipping cost is shown in the cart before you check out.",
  },
  {
    id: "faq-free",
    question: "When is shipping free?",
    answer: "Orders of $150 or more ship free. Under that amount, shipping is a flat $12.",
  },
  {
    id: "faq-tax",
    question: "How is tax calculated?",
    answer: "The cart adds an estimated 8% tax on the product subtotal so you can see an out-the-door total. Shipping is not taxed in this demo.",
  },
  {
    id: "faq-returns",
    question: "Can I return a product?",
    answer:
      "Yes. Unused items can be returned within 30 days of delivery in their original packaging. Because this checkout does not charge a card, the return policy is shown so the shopping flow matches a real store.",
  },
  {
    id: "faq-warranty",
    question: "What does the warranty cover?",
    answer:
      "Electronics devices include a 2-year limited warranty. Accessories include 1 year. The warranty covers manufacturing faults, not loss or accidental damage.",
  },
  {
    id: "faq-change",
    question: "Can I change quantities after adding an item?",
    answer:
      "Yes. On the cart page you can increase or decrease quantity, remove a line, or clear the cart. The total, shipping, and tax update immediately.",
  },
  {
    id: "faq-payment",
    question: "Will checkout charge my card?",
    answer:
      "No. Checkout asks for card details so the order form matches a store. The number is checked in the browser, and the receipt keeps only the last four digits. No payment is taken and nothing is shipped.",
  },
  {
    id: "faq-contact",
    question: "How do I reach support?",
    answer:
      "Call (800) 555-0199, email hello@veltryn.example, or use the contact form. Support hours are 8:00 a.m. to 8:00 p.m. Pacific, every day.",
  },
];

export default function Faqs() {
  usePageTitle("FAQs");
  const [openId, setOpenId] = useState(FAQS[0].id);

  return (
    <>
      <PageHero eyebrow="FAQs" title="Short answers before you add to cart.">
        Shipping, tax, returns, warranty, and what the demo checkout actually does.
      </PageHero>
      <Container className="max-w-3xl py-12">
        <div className="overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-slate-200">
          {FAQS.map((item) => {
            const open = openId === item.id;
            return (
              <div key={item.id} id={item.id} className="scroll-mt-32 border-b border-slate-100 last:border-b-0">
                <h2>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? "" : item.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
                  >
                    {item.question}
                    <ChevronDown size={18} className={`shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
                  </button>
                </h2>
                <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </>
  );
}
