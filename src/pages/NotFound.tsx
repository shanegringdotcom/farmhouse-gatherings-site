import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import TornSheet from "@/components/board/TornSheet";
import PushPin from "@/components/board/PushPin";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-corkboard px-6">
      <TornSheet variant="cream" rotate={-1.2} className="max-w-md text-center px-10 py-12">
        <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
        <h1 className="mb-3 font-marker text-5xl text-[#b3402f]">404</h1>
        <p className="mb-2 font-display text-xl font-semibold text-[#2b2520]">Oops! Page not found</p>
        <p className="mb-6 font-hand text-2xl text-[#2b2520]/60" style={{ transform: "rotate(-1deg)" }}>
          this note must have fallen off the board
        </p>
        <a
          href="/"
          className="font-typed text-sm font-bold uppercase tracking-wide text-[#b3402f] underline underline-offset-4 hover:text-[#8e2a1f]"
        >
          Return to Home
        </a>
      </TornSheet>
    </div>
  );
};

export default NotFound;
