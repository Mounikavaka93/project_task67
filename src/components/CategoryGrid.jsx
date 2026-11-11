import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/catalog";
import { buildShopPath } from "../utils/products";
import CategoryIcon from "./CategoryIcon";

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7">
      {CATEGORIES.map((category) => (
        <Link
          key={category.name}
          to={buildShopPath({ category: category.name })}
          className="group flex h-full min-w-0 flex-col items-start gap-4 rounded-3xl bg-white p-4 ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/80"
        >
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition duration-300 group-hover:scale-105 ${category.tint}`}>
            <CategoryIcon name={category.name} size={22} />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-lg font-bold leading-tight">{category.name}</span>
            <span className="mt-1 block text-sm leading-snug text-slate-500">{category.blurb}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
