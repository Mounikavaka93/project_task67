import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getProductById } from "../data/catalog";

const PRODUCT_IDS = [1, 4, 7, 10, 13, 16];

export default function OrbitStage() {
  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const products = PRODUCT_IDS.map((id) => getProductById(id)).filter(Boolean);

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring || products.length === 0) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const count = products.length;
    const step = 360 / count;

    let frame = 0;
    let spin = 16;
    let tiltX = 14;
    let tiltY = 0;
    let targetTiltX = 14;
    let targetTiltY = 0;
    let paused = false;
    let last = performance.now();

    const radius = () => (stage.clientWidth < 520 ? 118 : 188);

    const apply = (now) => {
      const orbit = radius();
      ring.style.setProperty("--orbit", `${orbit}px`);
      const bob = reduceMotion ? 0 : Math.sin(now / 900) * 10;
      ring.style.transform = `translateY(${bob}px) rotateX(${tiltX}deg) rotateY(${spin + tiltY}deg)`;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const base = index * step;
        const facing = (((base + spin + tiltY) % 360) + 360) % 360;
        const delta = facing > 180 ? 360 - facing : facing;
        const depth = 1 - delta / 180;
        card.style.transform = `rotateY(${base}deg) translateZ(${orbit}px) rotateY(${-(base + spin + tiltY)}deg)`;
        card.style.opacity = String(0.38 + depth * 0.62);
        card.style.zIndex = String(Math.round(depth * 30));
        card.style.pointerEvents = depth > 0.62 ? "auto" : "none";
      });
    };

    const onMove = (event) => {
      if (!canHover) return;
      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = px * 18;
      targetTiltX = 14 - py * 12;
    };

    const onEnter = () => {
      paused = true;
    };

    const onLeave = () => {
      paused = false;
      targetTiltX = 14;
      targetTiltY = 0;
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);

    if (reduceMotion) {
      apply(0);
      return () => {
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerenter", onEnter);
        stage.removeEventListener("pointerleave", onLeave);
      };
    }

    const loop = (now) => {
      const dt = Math.min(32, now - last);
      last = now;
      if (!paused && document.visibilityState !== "hidden") spin = (spin + dt * 0.02) % 360;
      tiltX += (targetTiltX - tiltX) * 0.08;
      tiltY += (targetTiltY - tiltY) * 0.08;
      apply(now);
      frame = window.requestAnimationFrame(loop);
    };

    frame = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [products.length]);

  return (
    <div ref={stageRef} className="orbit-stage" aria-label="Rotating 3D product showcase">
      <div className="orbit-glow" aria-hidden="true" />
      <div className="orbit-floor" aria-hidden="true" />
      <div ref={ringRef} className="orbit-ring">
        {products.map((product, index) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className="orbit-card"
          >
            <img src={product.image} alt="" draggable="false" />
            <span>{product.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
