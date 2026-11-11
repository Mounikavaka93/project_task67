import productsData from "./products.json";

export const CATEGORIES = [
  { name: "Mobiles", blurb: "Phones worth switching for", tint: "bg-violet-100 text-violet-700" },
  { name: "Laptops", blurb: "Power for work and play", tint: "bg-sky-100 text-sky-700" },
  { name: "Headphones", blurb: "Quiet the world around you", tint: "bg-rose-100 text-rose-700" },
  { name: "Smart TVs", blurb: "Cinema, at home", tint: "bg-amber-100 text-amber-800" },
  { name: "Cameras", blurb: "Capture it cleanly", tint: "bg-emerald-100 text-emerald-700" },
  { name: "Smartwatches", blurb: "Time, health, and alerts", tint: "bg-cyan-100 text-cyan-800" },
  { name: "Accessories", blurb: "The extras that matter", tint: "bg-fuchsia-100 text-fuchsia-700" },
];

export const products = productsData.map((product) => ({
  ...product,
  image: product.image || product.gallery?.[0],
}));

export function getProductById(id) {
  const numeric = Number(id);
  return products.find((product) => product.id === numeric);
}

export function getRelated(product, count = 4) {
  if (!product) return [];
  const same = products.filter((item) => item.category === product.category && item.id !== product.id);
  if (same.length >= count) return same.slice(0, count);
  const rest = products.filter((item) => item.id !== product.id && item.category !== product.category);
  return [...same, ...rest].slice(0, count);
}
