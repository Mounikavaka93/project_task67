import { useEffect } from "react";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Veltryn` : "Veltryn — Modern Electronics";
  }, [title]);
}
