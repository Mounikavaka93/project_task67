import { Link } from "react-router-dom";
import { Container, primaryButton } from "../components/ui";
import usePageTitle from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page not found");

  return (
    <Container className="py-24 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">404</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">That page is not on the shelf.</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
        The link may be old. The catalog is still here.
      </p>
      <Link to="/shop" className={`${primaryButton} mt-6`}>
        Browse electronics
      </Link>
    </Container>
  );
}
