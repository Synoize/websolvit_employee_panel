import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";

const MOBILE_QUERY = "(max-width: 767px)";

export function Toaster() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const onChange = (event) => setIsMobile(event.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return (
    <Sonner
      position={isMobile ? "top-center" : "bottom-right"}
      visibleToasts={1}
      expand={false}
      richColors
    />
  );
}
