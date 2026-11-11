import { Star } from "lucide-react";

export default function StarRating({ rating, reviews, size = 14 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => {
          const fill = Math.min(Math.max(rating - index, 0), 1);
          return (
            <span key={index} className="relative inline-flex" style={{ width: size, height: size }}>
              <Star size={size} className="text-slate-200" fill="currentColor" strokeWidth={0} />
              <span className="absolute left-0 top-0 overflow-hidden" style={{ width: `${fill * 100}%`, height: size }}>
                <Star size={size} className="text-amber-400" fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </div>
      <p className="text-sm text-slate-500">
        <span className="font-semibold text-ink">{Number(rating).toFixed(1)}</span>
        <span className="sr-only"> out of 5 stars</span>
        {reviews != null && <span className="text-slate-400"> ({reviews.toLocaleString()})</span>}
      </p>
    </div>
  );
}
