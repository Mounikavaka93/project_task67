import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, ShoppingBag, Trash2 } from "lucide-react";
import ProductImage from "../components/ProductImage";
import QuantityControl from "../components/QuantityControl";
import { Container, fieldClass, primaryButton } from "../components/ui";
import { getProductById } from "../data/catalog";
import { useCart } from "../context/CartContext";
import usePageTitle from "../hooks/usePageTitle";
import { FREE_SHIPPING_AT, summarize } from "../utils/cart";
import { formatPrice } from "../utils/currency";
import { cardBrand, digitsOnly, formatCardNumber, formatExpiry, validatePayment } from "../utils/payment";

const EMPTY_PAYMENT = { cardName: "", number: "", expiry: "", cvc: "", zip: "" };

function validateBuyer(buyer) {
  if (!buyer.name.trim()) return "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email.trim())) return "Enter a valid email.";
  return "";
}

function SummaryRow({ label, value, strong = false, accent = false }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "text-base" : "text-sm"}`}>
      <dt className={strong ? "font-bold text-white" : "text-slate-300"}>{label}</dt>
      <dd className={accent ? "font-bold text-cyan-200" : "font-semibold text-white"}>{value}</dd>
    </div>
  );
}

export default function Cart() {
  usePageTitle("Cart");
  const { items, updateQty, removeFromCart, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [buyer, setBuyer] = useState({ name: "", email: "" });
  const [payment, setPayment] = useState(EMPTY_PAYMENT);
  const [formError, setFormError] = useState("");
  const [receipt, setReceipt] = useState(null);

  const lines = items
    .map((item) => {
      const product = getProductById(item.id);
      return product ? { ...product, qty: item.qty } : null;
    })
    .filter(Boolean);
  const summary = summarize(lines);
  const progress = Math.min(100, (summary.subtotal / FREE_SHIPPING_AT) * 100);

  const placeOrder = (event) => {
    event.preventDefault();
    const buyerError = validateBuyer(buyer);
    const paymentError = validatePayment(payment);
    const error = buyerError || paymentError;
    if (error) {
      setFormError(error);
      return;
    }
    const digits = digitsOnly(payment.number);
    setReceipt({
      id: `VT-${Date.now().toString().slice(-8)}`,
      name: buyer.name.trim(),
      email: buyer.email.trim(),
      payment: { brand: cardBrand(digits), last4: digits.slice(-4) },
      lines,
      summary,
    });
    setPayment(EMPTY_PAYMENT);
    clearCart();
    setCheckingOut(false);
    setFormError("");
  };

  if (receipt) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 text-center ring-1 ring-slate-200 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-lagoon">Demo order placed</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold">Thanks, {receipt.name}.</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Order <span className="font-bold text-ink">{receipt.id}</span> is saved on this page only. No payment was taken and nothing will be shipped.
          </p>
          <p className="mt-2 text-sm text-slate-500">Confirmation contact: {receipt.email}</p>
          <p className="mt-1 text-sm text-slate-500">
            {receipt.payment.brand} ending {receipt.payment.last4}
          </p>
          <ul className="mt-6 space-y-2 text-left text-sm">
            {receipt.lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-4 border-b border-slate-100 py-2">
                <span>
                  {line.name} × {line.qty}
                </span>
                <span className="font-semibold">{formatPrice(line.price * line.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-display text-2xl font-extrabold">{formatPrice(receipt.summary.total)}</p>
          <Link to="/shop" className={`${primaryButton} mt-6`}>
            Continue shopping
          </Link>
        </div>
      </Container>
    );
  }

  if (lines.length === 0) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg rounded-[2rem] bg-white px-8 py-16 text-center ring-1 ring-slate-200">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sand text-aurora">
            <ShoppingBag size={24} />
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold">Your cart is empty</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Browse the latest electronics and add something you want to compare.
          </p>
          <Link to="/shop" className={`${primaryButton} mt-6`}>
            Start shopping
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Cart</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold">Your cart</h1>
        </div>
        <button type="button" onClick={clearCart} className="text-sm font-bold text-slate-500 hover:text-coral">
          Clear cart
        </button>
      </div>

      <div className={`mt-8 grid items-start gap-6 ${checkingOut ? "lg:grid-cols-[minmax(0,1fr)_400px]" : "lg:grid-cols-[minmax(0,1fr)_340px]"}`}>
        <ul className="space-y-4">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-4 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
              <Link to={`/product/${line.id}`} className="shrink-0 overflow-hidden rounded-2xl bg-mist">
                <ProductImage src={line.image} alt="" className="h-24 w-24 object-cover sm:h-28 sm:w-28" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/product/${line.id}`} className="font-display text-lg font-bold leading-tight hover:text-aurora">
                      {line.name}
                    </Link>
                    <p className="mt-1 text-sm text-slate-500">
                      {line.category} · {formatPrice(line.price)} each
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${line.name}`}
                    onClick={() => removeFromCart(line.id)}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-coral"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <QuantityControl
                    value={line.qty}
                    max={Math.min(10, line.stock)}
                    onChange={(next) => updateQty(line.id, next)}
                    label={line.name}
                  />
                  <div className="text-right">
                    <p className="font-display text-lg font-extrabold">{formatPrice(line.price * line.qty)}</p>
                    {line.originalPrice > line.price && (
                      <p className="text-xs text-slate-400 line-through">{formatPrice(line.originalPrice * line.qty)}</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className={`h-fit rounded-[1.75rem] bg-ink p-6 text-white ${checkingOut ? "" : "lg:sticky lg:top-32"}`}>
          <h2 className="font-display text-2xl font-extrabold">Summary</h2>
          <p className="mt-1 text-sm text-slate-300">
            {summary.count} {summary.count === 1 ? "item" : "items"}
          </p>
          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-gradient-to-r from-aurora to-cyan-300 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {summary.subtotal >= FREE_SHIPPING_AT
                ? "Free shipping is unlocked."
                : `Add ${formatPrice(FREE_SHIPPING_AT - summary.subtotal)} for free shipping.`}
            </p>
          </div>
          <dl className="mt-5 space-y-3">
            <SummaryRow label="Subtotal" value={formatPrice(summary.subtotal)} />
            {summary.savings > 0 && <SummaryRow label="You save" value={formatPrice(summary.savings)} accent />}
            <SummaryRow label="Shipping" value={summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)} />
            <SummaryRow label="Estimated tax" value={formatPrice(summary.tax)} />
            <div className="border-t border-white/10 pt-3">
              <SummaryRow label="Total" value={formatPrice(summary.total)} strong />
            </div>
          </dl>

          {checkingOut ? (
            <form onSubmit={placeOrder} noValidate className="mt-6 space-y-4">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Contact</p>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" htmlFor="buyer-name">
                    Name
                  </label>
                  <input
                    id="buyer-name"
                    name="name"
                    value={buyer.name}
                    onChange={(event) => {
                  setBuyer((current) => ({ ...current, name: event.target.value }));
                  setFormError("");
                }}
                    autoComplete="name"
                    className={`${fieldClass} text-ink`}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" htmlFor="buyer-email">
                    Email
                  </label>
                  <input
                    id="buyer-email"
                    name="email"
                    type="email"
                    value={buyer.email}
                    onChange={(event) => {
                  setBuyer((current) => ({ ...current, email: event.target.value }));
                  setFormError("");
                }}
                    autoComplete="email"
                    className={`${fieldClass} text-ink`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                  <CreditCard size={14} />
                  Payment
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" htmlFor="card-name">
                    Name on card
                  </label>
                  <input
                    id="card-name"
                    name="cc-name"
                    value={payment.cardName}
                    onChange={(event) => {
                      setPayment((current) => ({ ...current, cardName: event.target.value }));
                      setFormError("");
                    }}
                    autoComplete="cc-name"
                    className={`${fieldClass} text-ink`}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" htmlFor="card-number">
                    Card number
                  </label>
                  <div className="relative">
                    <input
                      id="card-number"
                      name="cc-number"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      spellCheck="false"
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      value={payment.number}
                      onChange={(event) => {
                        const number = formatCardNumber(event.target.value);
                        const cvcMax = cardBrand(number) === "American Express" ? 4 : 3;
                        setPayment((current) => ({
                          ...current,
                          number,
                          cvc: digitsOnly(current.cvc).slice(0, cvcMax),
                        }));
                        setFormError("");
                      }}
                      className={`${fieldClass} pr-28 text-ink`}
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      {digitsOnly(payment.number).length > 0
                        ? cardBrand(payment.number) === "American Express"
                          ? "Amex"
                          : cardBrand(payment.number)
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="card-expiry">
                      Expiry
                    </label>
                    <input
                      id="card-expiry"
                      name="cc-exp"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={payment.expiry}
                      onChange={(event) => {
                        setPayment((current) => ({ ...current, expiry: formatExpiry(event.target.value, current.expiry) }));
                        setFormError("");
                      }}
                      className={`${fieldClass} text-ink`}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="card-cvc">
                      Security code
                    </label>
                    <input
                      id="card-cvc"
                      name="cc-csc"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder={cardBrand(payment.number) === "American Express" ? "1234" : "123"}
                      maxLength={4}
                      value={payment.cvc}
                      onChange={(event) => {
                        setPayment((current) => ({
                          ...current,
                          cvc: digitsOnly(event.target.value).slice(0, cardBrand(current.number) === "American Express" ? 4 : 3),
                        }));
                        setFormError("");
                      }}
                      className={`${fieldClass} text-ink`}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" htmlFor="card-zip">
                    Billing ZIP
                  </label>
                  <input
                    id="card-zip"
                    name="postal-code"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="94107"
                    maxLength={5}
                    value={payment.zip}
                    onChange={(event) => {
                      setPayment((current) => ({ ...current, zip: digitsOnly(event.target.value).slice(0, 5) }));
                      setFormError("");
                    }}
                    className={`${fieldClass} text-ink`}
                  />
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  Try 4242 4242 4242 4242 with any future date. The full number is not saved.
                </p>
              </div>

              {formError && (
                <p className="text-sm text-rose-200" role="alert">
                  {formError}
                </p>
              )}
              <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-ink transition hover:bg-cyan-50">
                Place demo order
              </button>
              <button
                type="button"
                onClick={() => {
                  setCheckingOut(false);
                  setFormError("");
                }}
                className="w-full text-sm font-semibold text-slate-300"
              >
                Back to summary
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setCheckingOut(true)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-cyan-50"
            >
              Checkout
            </button>
          )}
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            Card details stay in this browser. We will not charge a card or send an order.
          </p>
        </aside>
      </div>
    </Container>
  );
}
