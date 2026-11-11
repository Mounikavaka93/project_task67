import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, RotateCcw, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import QuantityControl from "../components/QuantityControl";
import StarRating from "../components/StarRating";
import { Container, primaryButton } from "../components/ui";
import { getProductById, getRelated } from "../data/catalog";
import { useCart } from "../context/CartContext";
import usePageTitle from "../hooks/usePageTitle";
import { formatPrice } from "../utils/currency";
import { buildShopPath, discountPercent } from "../utils/products";

export default function ProductDetails() {
  const { id } = useParams();
  const product = getProductById(id);
  const { addToCart, items } = useCart();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const photos = product?.gallery?.length ? product.gallery : product ? [product.image] : [];

  usePageTitle(product ? product.name : "Product");

  useEffect(() => {
    setActive(0);
    setQty(1);
  }, [product?.id]);

  if (!product) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-4xl font-extrabold">We could not find that product.</h1>
        <p className="mt-3 text-slate-500">It may have left the catalog.</p>
        <Link to="/shop" className={`${primaryButton} mt-6`}>
          Back to shop
        </Link>
      </Container>
    );
  }

  const discount = discountPercent(product);
  const cap = Math.min(10, product.stock);
  const inCart = items.find((item) => item.id === product.id);
  const related = getRelated(product, 4);

  const add = () => addToCart(product, qty);

  return (
    <div className="pb-28 md:pb-16">
      <Container className="py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-ink">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/shop" className="hover:text-ink">Shop</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={buildShopPath({ category: product.category })} className="hover:text-ink">
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-ink" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <div className="overflow-hidden rounded-[2rem] bg-mist ring-1 ring-slate-200">
              <ProductImage
                src={photos[active]}
                alt={product.name}
                loading="eager"
                className="aspect-square w-full object-cover sm:aspect-[4/3]"
              />
            </div>
            {photos.length > 1 && (
              <div className="mt-3 flex gap-3">
                {photos.map((photo, index) => (
                  <button
                    key={photo}
                    type="button"
                    aria-label={`${product.name} photo ${index + 1}`}
                    onClick={() => setActive(index)}
                    className={`overflow-hidden rounded-2xl ring-2 transition ${
                      index === active ? "ring-aurora" : "ring-transparent hover:ring-slate-300"
                    }`}
                  >
                    <ProductImage src={photo} alt="" className="h-20 w-20 object-cover sm:h-24 sm:w-24" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-32">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">{product.category}</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-sm text-slate-500">
              {product.brand} · SKU {product.sku}
            </p>
            <div className="mt-4">
              <StarRating rating={product.rating} reviews={product.reviews} />
            </div>
            <div className="mt-5 flex flex-wrap items-end gap-3">
              <p className="font-display text-4xl font-extrabold">{formatPrice(product.price)}</p>
              {discount > 0 && (
                <p className="pb-1 text-slate-400">
                  <span className="line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="ml-2 font-bold text-coral">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </p>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{product.description}</p>
            <p className={`mt-4 text-sm font-bold ${product.stock < 5 ? "text-coral" : "text-lagoon"}`}>
              {product.stock > 5 ? "In stock and ready to ship" : product.stock > 0 ? `Only ${product.stock} left` : "Out of stock"}
            </p>
            {inCart && <p className="mt-1 text-sm text-slate-500">{inCart.qty} already in your cart</p>}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <QuantityControl value={qty} max={Math.max(cap, 1)} onChange={setQty} label={product.name} />
              <button type="button" onClick={add} disabled={product.stock < 1} className={`${primaryButton} min-w-44 disabled:opacity-50`}>
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>

            <ul className="mt-6 grid items-stretch gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <li className="flex h-full items-center gap-2 rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-200">
                <Truck size={16} className="shrink-0 text-aurora" /> Free over $150
              </li>
              <li className="flex h-full items-center gap-2 rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-200">
                <RotateCcw size={16} className="shrink-0 text-aurora" /> 30-day returns
              </li>
              <li className="flex h-full items-center gap-2 rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-200">
                <ShieldCheck size={16} className="shrink-0 text-aurora" /> Warranty included
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-2">
          <section className="h-full rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
            <h2 className="font-display text-2xl font-extrabold">Description</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{product.description}</p>
            <ul className="mt-5 space-y-2">
              {product.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check size={16} className="mt-0.5 shrink-0 text-lagoon" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="h-full rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
            <h2 className="font-display text-2xl font-extrabold">Specifications</h2>
            <dl className="mt-4 divide-y divide-slate-100">
              {Object.entries(product.specs).map(([label, value]) => (
                <div key={label} className="grid grid-cols-[38%_1fr] items-baseline gap-3 py-3 text-sm">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-3xl font-extrabold">You may also like</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div>
            <p className="text-xs text-slate-500">Total</p>
            <p className="font-display text-lg font-extrabold">{formatPrice(product.price * qty)}</p>
          </div>
          <button type="button" onClick={add} disabled={product.stock < 1} className={`${primaryButton} flex-1`}>
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
