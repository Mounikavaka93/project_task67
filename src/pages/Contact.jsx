import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container, PageHero, fieldClass, primaryButton } from "../components/ui";
import usePageTitle from "../hooks/usePageTitle";

const topics = ["Order help", "Product question", "Returns", "Warranty", "Something else"];

const empty = { name: "", email: "", topic: "Order help", message: "" };

export default function Contact() {
  usePageTitle("Contact");
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (form.message.trim().length < 12) next.message = "Tell us a little more — at least 12 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  return (
    <>
      <PageHero eyebrow="Contact" title="We are here every day.">
        Questions about a product, a return, or an order in your cart. Send a note and we will show it as received on this page.
      </PageHero>
      <Container className="grid gap-6 py-12 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="space-y-3">
          <article className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
            <Mail className="text-aurora" size={18} />
            <h2 className="mt-3 font-display text-xl font-bold">Email</h2>
            <a href="mailto:hello@veltryn.example" className="mt-1 block text-sm font-semibold text-indigo-700">
              hello@veltryn.example
            </a>
          </article>
          <article className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
            <Phone className="text-aurora" size={18} />
            <h2 className="mt-3 font-display text-xl font-bold">Phone</h2>
            <a href="tel:+18005550199" className="mt-1 block text-sm font-semibold text-indigo-700">
              (800) 555-0199
            </a>
            <p className="mt-1 text-sm text-slate-500">Every day, 8:00 a.m. – 8:00 p.m. PT</p>
          </article>
          <article className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
            <MapPin className="text-aurora" size={18} />
            <h2 className="mt-3 font-display text-xl font-bold">Studio</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Veltryn ships nationwide from a San Francisco studio. This demo does not dispatch real parcels.
            </p>
          </article>
        </aside>

        <div className="rounded-[2rem] bg-white p-6 ring-1 ring-slate-200 sm:p-8">
          {sent ? (
            <div role="status">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-lagoon">Message noted</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold">Thanks, {form.name.trim()}.</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                We saved your note in this browser session only. Nothing was sent to a server. If this were the live shop, a person would reply at {form.email}.
              </p>
              <button
                type="button"
                className={`${primaryButton} mt-6`}
                onClick={() => {
                  setSent(false);
                  setForm(empty);
                }}
              >
                Send another note
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <h2 className="font-display text-2xl font-extrabold">Send a message</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold">
                    Name
                  </label>
                  <input id="contact-name" value={form.name} onChange={update("name")} autoComplete="name" className={fieldClass} />
                  {errors.name && <p className="mt-1 text-sm text-coral" role="alert">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold">
                    Email
                  </label>
                  <input id="contact-email" type="email" value={form.email} onChange={update("email")} autoComplete="email" className={fieldClass} />
                  {errors.email && <p className="mt-1 text-sm text-coral" role="alert">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="contact-topic" className="mb-1.5 block text-sm font-semibold">
                  Topic
                </label>
                <select id="contact-topic" value={form.topic} onChange={update("topic")} className={fieldClass}>
                  {topics.map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold">
                  Message
                </label>
                <textarea id="contact-message" rows={5} value={form.message} onChange={update("message")} className={fieldClass} />
                {errors.message && <p className="mt-1 text-sm text-coral" role="alert">{errors.message}</p>}
              </div>
              <button type="submit" className={primaryButton}>
                Send message
              </button>
            </form>
          )}
        </div>
      </Container>
    </>
  );
}
