import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

// Deliberately three items and one button — the nav had grown to ten flat items
// and was wrapping onto two lines by 820px.
//
// This is a single-property rental: the homepage is a scroller, so the nav's
// real job is "what's the lake like", "what does the house have", and "let me
// book". Our Family and the contact address still live only in the footer.
//
// "Guides" is the one exception to the flat list. It was a bare link to
// /big-long-lake, which quietly hid the other two guides from anyone not
// scrolling to the footer — so it is now a dropdown over all three. That keeps
// the bar at three items while making the whole set reachable in one hover.
//
// The same set renders on every page, so there is no context switching. Hash
// links resolve to /#section off the homepage; see hrefFor below.
//
// Styling: bulletin-board whimsy — links are little paper tabs pinned to the
// bar, the brand is handwritten, Inquire is a rubber stamp. All logic
// (hrefFor, smooth scroll, dropdown open/close, prerendered panel) unchanged.
const GUIDES = [
  { label: "Big Long Lake", href: "/big-long-lake" },
  { label: "Northern Indiana Lakes", href: "/northern-indiana-lakes" },
  { label: "Ice Cream", href: "/northern-indiana-ice-cream" },
];

const links = [
  { label: "The Lake", href: "#lake", tilt: "-rotate-2" },
  { label: "Details", href: "#details", tilt: "rotate-1" },
];

const PIN_DOTS = ["bg-[#c0392b]", "bg-[#d9a400]", "bg-[#3d7a44]"];

// A paper-tab nav link: cream chip, typed text, a pushpin dot up top, and a
// tilt that straightens on hover.
const tabClass = (tilt: string, active = false) =>
  `relative font-typed text-[11px] font-bold uppercase tracking-wide whitespace-nowrap ` +
  `bg-[#f2e8d5] px-3 pt-2 pb-1.5 shadow-pinned ${tilt} hover:rotate-0 transition-transform ` +
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ` +
  `${active ? "text-[#b3402f]" : "text-[#2b2520]"}`;

const PinDot = ({ color }: { color: string }) => (
  <span
    aria-hidden="true"
    className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${color} ring-1 ring-black/25 shadow-sm`}
  />
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const guidesRef = useRef<HTMLDivElement>(null);

  // The #section targets all live on the homepage. On /about and
  // /big-long-lake they don't exist, so a bare "#inquire" href pointed at
  // nothing and the click handler swallowed the event — the link was simply
  // dead. Off the homepage we emit "/#inquire" instead and let the browser
  // navigate. useLocation (not window) so this is correct during prerender too.
  const location = useLocation();
  const isHome = location.pathname === "/";
  const onGuide = GUIDES.some((g) => g.href === location.pathname);

  const hrefFor = (href: string) =>
    href.startsWith("#") && !isHome ? `/${href}` : href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only intercept for smooth scrolling when the target is on this page.
    if (!href.startsWith("#") || !isHome) return; // let normal links navigate
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Close the dropdown on outside click and on Escape. Both listeners are set
  // up in an effect, so neither runs during prerender.
  useEffect(() => {
    if (!guidesOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!guidesRef.current?.contains(e.target as Node)) setGuidesOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGuidesOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [guidesOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b-2 border-[#7a5a38]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        <a
          href="/"
          onClick={(e) => handleClick(e, "#hero")}
          className="font-hand text-2xl sm:text-[1.7rem] font-bold text-foreground whitespace-nowrap shrink-0 -rotate-2 hover:rotate-0 transition-transform"
        >
          The Farmhouse
        </a>

        {/* Three items and a button fit comfortably from ~700px, so md is safe
            again — the earlier lg breakpoint existed only to hide seven. */}
        <div className="hidden md:flex items-center gap-5 lg:gap-6">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={hrefFor(l.href)}
              onClick={(e) => handleClick(e, l.href)}
              className={tabClass(l.tilt)}
            >
              <PinDot color={PIN_DOTS[i]} />
              {l.label}
            </a>
          ))}

          {/* Guides dropdown. Opens on hover for mice and on click/keyboard for
              everyone else. The panel is always in the DOM and hidden with
              `invisible` rather than unmounted: visibility:hidden drops it from
              the tab order and the a11y tree, but the three links still ship in
              the prerendered HTML for crawlers. */}
          <div
            ref={guidesRef}
            className="relative"
            onMouseEnter={() => setGuidesOpen(true)}
            onMouseLeave={() => setGuidesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setGuidesOpen((v) => !v)}
              aria-expanded={guidesOpen}
              aria-haspopup="true"
              className={`${tabClass("-rotate-1", onGuide)} flex items-center gap-1`}
            >
              <PinDot color={PIN_DOTS[2]} />
              Guides
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  guidesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute top-full right-0 pt-3 transition-opacity duration-150 ${
                guidesOpen ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <ul className="min-w-[15rem] bg-paper torn-edge-b shadow-lifted py-2 pb-4 rotate-1">
                {GUIDES.map((g) => (
                  <li key={g.href}>
                    <a
                      href={g.href}
                      onClick={() => setGuidesOpen(false)}
                      className={`block px-4 py-2.5 font-typed text-sm font-bold transition-colors hover:bg-[#2b2520]/5 hover:text-[#b3402f] ${
                        location.pathname === g.href
                          ? "text-[#b3402f]"
                          : "text-[#2b2520]/75"
                      }`}
                    >
                      {g.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a
            href={hrefFor("#inquire")}
            onClick={(e) => handleClick(e, "#inquire")}
            className="relative font-marker uppercase tracking-wider text-xs bg-[#b3402f] text-[#fdf6e8] px-4 py-2 border-2 border-[#7a2418] shadow-pinned -rotate-1 hover:rotate-0 transition-transform whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0.5 border border-dashed border-[#fdf6e8]/45 pointer-events-none"
            />
            Inquire
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-3 min-w-[48px] min-h-[48px] flex items-center justify-center text-foreground shrink-0"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu. The guides are listed inline rather than behind an
          accordion — there are only three, and a second tap to reach them is
          the friction this change set out to remove. Styled as a paper sheet
          tacked under the bar. */}
      {open && (
        <div className="md:hidden bg-paper torn-edge-b px-4 pb-7 pt-1 shadow-lifted">
          {links.map((l) => (
            <a
              key={l.href}
              href={hrefFor(l.href)}
              onClick={(e) => handleClick(e, l.href)}
              className="block w-full text-left py-3 font-typed text-sm font-bold uppercase tracking-wide text-[#2b2520]/80 hover:text-[#b3402f] border-b border-[#2b2520]/10"
            >
              {l.label}
            </a>
          ))}

          <p className="pt-4 pb-1 font-hand text-lg text-[#2b2520]/50">
            Guides
          </p>
          {GUIDES.map((g) => (
            <a
              key={g.href}
              href={g.href}
              onClick={() => setOpen(false)}
              className={`block w-full text-left py-3 pl-3 font-typed text-sm font-bold border-b border-[#2b2520]/10 hover:text-[#b3402f] ${
                location.pathname === g.href
                  ? "text-[#b3402f]"
                  : "text-[#2b2520]/75"
              }`}
            >
              {g.label}
            </a>
          ))}

          <a
            href={hrefFor("#inquire")}
            onClick={(e) => handleClick(e, "#inquire")}
            className="relative block w-full text-center mt-5 py-3 font-marker uppercase tracking-wider text-sm bg-[#b3402f] text-[#fdf6e8] border-2 border-[#7a2418] shadow-pinned"
          >
            <span
              aria-hidden="true"
              className="absolute inset-1 border border-dashed border-[#fdf6e8]/45 pointer-events-none"
            />
            Inquire
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
