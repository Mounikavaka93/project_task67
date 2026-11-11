import { Link } from "react-router-dom";

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Veltryn home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-aurora via-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-aurora/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 15c3.5-6 5-6 7.2-1.5C13.2 9 15 9 20 13" />
        </svg>
      </span>
      <span className={`font-display text-[1.35rem] font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Veltryn
      </span>
    </Link>
  );
}
