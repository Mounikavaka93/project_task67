import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { discountPercent } from "../utils/products";
import { formatPrice } from "../utils/currency";
import ProductImage from "./ProductImage";
import StarRating from "./StarRating";

export default function ProductCard({ product, style }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const discount = discountPercent(product);

  useEffect(() => {
    if (!added) return undefined;
    const timer = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <article
      style={style}
      className="animate-rise group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.65)] ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(83,70,245,0.55)]"
    >
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-mist">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-coral px-2.5 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-ink">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">{product.category}</p>
        <Link to={`/product/${product.id}`} className="mt-1">
          <h3 className="line-clamp-2 min-h-[2.75rem] font-display text-lg font-bold leading-snug text-ink">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm text-slate-500">{product.brand}</p>
        <div className="mt-3">
          <StarRating rating={product.rating} reviews={product.reviews} />
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-xl font-extrabold">{formatPrice(product.price)}</span>
          {discount > 0 && (
            <span className="pb-0.5 text-sm text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <p className="mt-2 h-4 text-xs font-bold text-coral" aria-hidden={product.stock >= 5}>
          {product.stock < 5 ? `Only ${product.stock} left` : ""}
        </p>
        <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={() => {
            addToCart(product, 1);
            setAdded(true);
          }}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white transition duration-200 active:scale-[0.98] ${
            added ? "bg-lagoon" : "bg-ink group-hover:bg-aurora"
          }`}
        >
          {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          {added ? "Added" : "Add to Cart"}
        </button>
        </div>
      </div>
    </article>
  );
}
