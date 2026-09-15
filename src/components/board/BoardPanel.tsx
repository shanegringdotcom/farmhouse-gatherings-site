import type { ReactNode } from "react";

// A section of the continuous corkboard (the page background is cork — see
// Index.tsx). A spacing/width container that owns the section ids the Navbar
// and use-hash-scroll rely on.
const BoardPanel = ({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) => (
  <section id={id} className="py-14 sm:py-20 px-4 sm:px-6">
    <div className={`max-w-6xl mx-auto ${className}`}>{children}</div>
  </section>
);

export default BoardPanel;
