import { useState } from "react";

export default function ProductImage({ src, alt, className = "", loading = "lazy" }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-violet-100 via-white to-cyan-100 ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-display text-4xl font-extrabold text-aurora/70">{alt?.slice(0, 1) || "A"}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
