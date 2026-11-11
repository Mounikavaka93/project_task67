export const PRICE_FILTERS = [
  { id: "all", label: "All prices", test: () => true },
  { id: "under-100", label: "Under $100", test: (product) => product.price < 100 },
  { id: "100-500", label: "$100 – $500", test: (product) => product.price >= 100 && product.price <= 500 },
  { id: "500-1000", label: "$500 – $1,000", test: (product) => product.price > 500 && product.price <= 1000 },
  { id: "over-1000", label: "Over $1,000", test: (product) => product.price > 1000 },
];

export const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top rated" },
  { id: "discount", label: "Biggest discount" },
];

export function discountPercent(product) {
  const original = Number(product.originalPrice);
  const price = Number(product.price);
  if (!original || original <= price) return 0;
  return Math.round((1 - price / original) * 100);
}

export function shopParams({ query, category, sort, price } = {}) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category && category !== "All") params.set("category", category);
  if (sort && sort !== "featured") params.set("sort", sort);
  if (price && price !== "all") params.set("price", price);
  return params;
}

export function buildShopPath(filters) {
  const value = shopParams(filters).toString();
  return value ? `/shop?${value}` : "/shop";
}

export function filterProducts(products, options = {}) {
  if (!Array.isArray(products)) return [];

  const words = (options.query ?? "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const category = options.category && options.category !== "All" ? options.category : "";
  const priceFilter = PRICE_FILTERS.find((item) => item.id === options.price) ?? PRICE_FILTERS[0];
  const sort = options.sort ?? "featured";

  const list = products.filter((product) => {
    const haystack = [
      product.name,
      product.brand,
      product.category,
      product.description,
      product.sku,
      ...(product.tags ?? []),
      ...(product.highlights ?? []),
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = words.every((word) => haystack.includes(word));
    const matchesCategory = !category || product.category.toLowerCase() === category.toLowerCase();
    return matchesQuery && matchesCategory && priceFilter.test(product);
  });

  if (sort === "price-asc") list.sort((a, b) => a.price - b.price || a.id - b.id);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price || a.id - b.id);
  else if (sort === "rating") list.sort((a, b) => b.rating - a.rating || a.price - b.price);
  else if (sort === "discount") list.sort((a, b) => discountPercent(b) - discountPercent(a) || a.price - b.price);
  else list.sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)) || b.rating - a.rating || a.id - b.id);

  return list;
}
