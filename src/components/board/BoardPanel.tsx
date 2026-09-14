import type { ReactNode } from "react";

// A framed corkboard panel hung on the dark "lodge wall" (the page
// background), or a bare wall section for items that hang directly on it.
// Owns the section ids the Navbar and use-hash-scroll rely on.
const BoardPanel = ({
  id,
  surface = "cork",
  className = "",
  children,
}: {
  id: string;
  surface?: "cork" | "wall";
  className?: string;
  children: ReactNode;
}) => (
  <section id={id} className="py-12 sm:py-16 px-3 sm:px-6">
    {surface === "cork" ? (
      <div
        className={`max-w-6xl mx-auto bg-corkboard frame-wood px-4 py-12 sm:px-10 sm:py-16 lg:px-14 ${className}`}
      >
        {children}
      </div>
    ) : (
      <div className={`max-w-6xl mx-auto px-1 py-6 sm:py-10 ${className}`}>{children}</div>
    )}
  </section>
);

export default BoardPanel;
