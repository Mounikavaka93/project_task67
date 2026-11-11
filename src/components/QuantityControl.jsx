import { Minus, Plus } from "lucide-react";

export default function QuantityControl({ value, onChange, min = 1, max = 10, label = "item" }) {
  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1">
      <button
        type="button"
        aria-label={`Decrease quantity of ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-sand disabled:opacity-30"
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center text-sm font-bold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase quantity of ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-sand disabled:opacity-30"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
