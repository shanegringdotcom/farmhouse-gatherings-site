import { useLocation } from "react-router-dom";
import { CONTACT_EMAIL, trackContactClick } from "@/lib/analytics";

// The nav is deliberately down to three links and a button, so the footer is
// where the full set lives — every homepage section plus both guides. That
// keeps everything one click away and gives each page internal links to all of
// it for crawling, without the top bar competing with the Inquire button.
const groups = [
  {
    title: "Explore",
    links: [
      { label: "About", href: "#about" },
      { label: "Experience", href: "#experience" },
      { label: "The Lake", href: "#lake" },
      { label: "The Area", href: "#area" },
      { label: "Details", href: "#details" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "Big Long Lake Guide", href: "/big-long-lake" },
      { label: "Lake History", href: "/history-of-big-long-lake" },
      { label: "Northern Indiana Lakes", href: "/northern-indiana-lakes" },
      { label: "Ice Cream Guide", href: "/northern-indiana-ice-cream" },
    ],
  },
  {
    title: "The Farmhouse",
    links: [
      { label: "Our Family", href: "/about" },
      { label: "Inquire", href: "#inquire" },
    ],
  },
];

const Footer = () => {
  // Section anchors only exist on the homepage — off it they must resolve to
  // /#section or they point at nothing. Same rule as the nav.
  const isHome = useLocation().pathname === "/";
  const hrefFor = (href: string) =>
    href.startsWith("#") && !isHome ? `/${href}` : href;

  return (
    <footer className="pt-16 pb-12 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-display text-lg italic text-foreground/70 mb-2">
            The Farmhouse at Big Long Lake
          </p>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-foreground/30">
            Wolcottville, Indiana
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10 text-center sm:text-left max-w-3xl mx-auto"
        >
          {groups.map((g) => (
            <div key={g.title}>
              <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/30 mb-4">
                {g.title}
              </p>
              <ul className="space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={hrefFor(l.href)}
                      className="font-body text-sm text-foreground/55 hover:text-secondary transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="text-center mt-14 pt-8 border-t border-border/20">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            onClick={() => trackContactClick("email", "footer")}
            className="font-body text-sm text-foreground/50 hover:text-secondary transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
