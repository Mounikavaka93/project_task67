import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="relative bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-10 py-2 text-center text-xs font-semibold sm:text-sm">
        <p>
          Free shipping over $150
          <span className="hidden sm:inline"> · 30-day returns · 2-year warranty</span>
        </p>
        <Link to="/support#shipping" className="font-bold text-cyan-200 underline-offset-2 hover:underline">
          Details
        </Link>
      </div>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}
