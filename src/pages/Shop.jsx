import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ShopFilters from "../components/ShopFilters";
import { Container, fieldClass, ghostButton, primaryButton } from "../components/ui";
import { CATEGORIES, products } from "../data/catalog";
import usePageTitle from "../hooks/usePageTitle";
import { PRICE_FILTERS, SORTS, filterProducts, shopParams } from "../utils/products";

function Chip({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink ring-1 ring-slate-200 transition hover:ring-aurora"
    >
      {children}
      <span className="ml-2 text-slate-400" aria-hidden="true">
        ×
      </span>
    </button>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = params.get("q") ?? "";
  const categoryParam = params.get("category");
  const category = categoryParam || "All";
  const sortParam = params.get("sort");
  const sort = SORTS.some((item) => item.id === sortParam) ? sortParam : "featured";
  const priceParam = params.get("price");
  const price = PRICE_FILTERS.some((item) => item.id === priceParam) ? priceParam : "all";
  const priceLabel = PRICE_FILTERS.find((item) => item.id === price)?.label ?? "All prices";

  const knownCategory = category === "All" || CATEGORIES.some((item) => item.name.toLowerCase() === category.toLowerCase());
  const heading = query ? "Search results" : !knownCategory ? "Catalog" : category === "All" ? "All electronics" : category;

  usePageTitle(query ? `Search: ${query}` : heading);

  const results = useMemo(
    () => filterProducts(products, { query, category, sort, price }),
    [query, category, sort, price],
  );

  const update = (patch) => {
    setParams(
      shopParams({
        query: patch.query !== undefined ? patch.query : query,
        category: patch.category !== undefined ? patch.category : category,
        sort: patch.sort !== undefined ? patch.sort : sort,
        price: patch.price !== undefined ? patch.price : price,
      }),
      { replace: true },
    );
  };

  const hasActive = category !== "All" || price !== "all";

  return (
    <div>
      <div className="border-b border-mist bg-white">
        <Container className="py-8 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Catalog</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{heading}</h1>
          {query && (
            <p className="mt-3 text-slate-500">
              Showing matches for <span className="font-semibold text-ink">“{query}”</span>
            </p>
          )}
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form
            className="relative flex-1"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="shop-search" className="sr-only">
              Search products
            </label>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              id="shop-search"
              type="search"
              value={query}
              onChange={(event) => update({ query: event.target.value })}
              placeholder="Search by name, brand, or feature"
              className={`${fieldClass} h-12 py-0 pl-11`}
            />
          </form>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-56">
              <label htmlFor="sort" className="sr-only">
                Sort products
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => update({ sort: event.target.value })}
                className="h-12 w-full appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-10 text-sm font-semibold"
              >
                {SORTS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
            <button
              type="button"
              className={`${ghostButton} h-12 w-full sm:w-auto lg:hidden`}
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <SlidersHorizontal size={16} />
              {filtersOpen ? "Hide filters" : "Filters"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500" aria-live="polite">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
          {(query || hasActive) && (
            <div className="flex flex-wrap gap-2">
              {query && <Chip onClick={() => update({ query: "" })}>Search: {query}</Chip>}
              {category !== "All" && <Chip onClick={() => update({ category: "All" })}>{category}</Chip>}
              {price !== "all" && <Chip onClick={() => update({ price: "all" })}>{priceLabel}</Chip>}
            </div>
          )}
        </div>

        <div className="mt-4 grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className={filtersOpen ? "block" : "hidden lg:block"}>
            <ShopFilters
              category={category}
              price={price}
              hasActive={hasActive}
              onCategory={(value) => update({ category: value })}
              onPrice={(value) => update({ price: value })}
              onClear={() => update({ category: "All", price: "all" })}
            />
          </aside>

          <div className="min-w-0">
            {results.length === 0 ? (
              <div className="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-slate-200">
                <Search className="mx-auto text-slate-300" size={32} />
                <h2 className="mt-4 font-display text-2xl font-extrabold">No matching products</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                  Try another word, a different category, or a wider price range.
                </p>
                <button type="button" className={`${primaryButton} mt-6`} onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((product, index) => (
                  <ProductCard key={product.id} product={product} style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
