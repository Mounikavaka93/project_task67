import { CATEGORIES } from "../data/catalog";
import { PRICE_FILTERS } from "../utils/products";

function FilterButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
        active ? "bg-ink text-white" : "text-slate-600 hover:bg-sand hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function ShopFilters({ category, price, onCategory, onPrice, onClear, hasActive }) {
  return (
    <div className="space-y-8 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-extrabold">Filters</h2>
        {hasActive && (
          <button type="button" onClick={onClear} className="text-sm font-bold text-aurora">
            Clear
          </button>
        )}
      </div>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Category</legend>
        <div className="mt-3 flex flex-col gap-1">
          <FilterButton active={category === "All"} onClick={() => onCategory("All")}>
            All electronics
          </FilterButton>
          {CATEGORIES.map((item) => (
            <FilterButton key={item.name} active={category === item.name} onClick={() => onCategory(item.name)}>
              {item.name}
            </FilterButton>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Price</legend>
        <div className="mt-3 flex flex-col gap-1">
          {PRICE_FILTERS.map((item) => (
            <FilterButton key={item.id} active={price === item.id} onClick={() => onPrice(item.id)}>
              {item.label}
            </FilterButton>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
