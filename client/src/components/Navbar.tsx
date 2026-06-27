import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [location, navigate] = useLocation();
  const isMobile = useIsMobile();

  const links = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/channels", label: "Channels" },
  ];
  const utilityLinks = [
    { href: "/about", label: "About" },
    { href: "/feedback", label: "Feedback" },
  ];

  const isActive = (href: string) => location === href;
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleaned = query.trim();
    if (!cleaned) {
      navigate("/categories");
      setIsOpen(false);
      return;
    }

    navigate(`/categories?q=${encodeURIComponent(cleaned)}`);
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isMobile || !isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobile, isOpen]);

  return (
    <nav className="site-nav">
      <div className="site-masthead">
        <div className="site-container site-masthead-inner">
          <Link href="/" className="brand-lockup" onClick={() => setIsOpen(false)}>
            <span className="brand-mark">
              futile<span className="brand-mark-accent">.</span>in
            </span>
            <span className="brand-tagline">Helping simplify learning paths</span>
          </Link>

          {!isMobile ? (
            <form onSubmit={handleSearchSubmit} className="masthead-search">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search guides, jobs, DSA, interview..."
                aria-label="Search guides"
                className="masthead-search-input"
              />
              <button type="submit" className="masthead-search-button">
                <Search size={16} />
                <span>Search</span>
              </button>
            </form>
          ) : null}

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="icon-link site-nav-toggle md:hidden"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {!isMobile ? (
        <div className="site-nav-band">
          <div className="site-container site-nav-band-inner">
            <div className="site-nav-links">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              {utilityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-utility-link ${
                    isActive(link.href) ? "nav-link-active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {isMobile && isOpen ? (
        <div className="site-nav-mobile-shell md:hidden">
          <button
            type="button"
            className="site-nav-mobile-backdrop"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
          />
          <div className="site-container site-nav-mobile">
            <div className="card site-nav-mobile-card">
              <div className="site-nav-mobile-header">
                <p className="site-nav-mobile-label">Navigate</p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="icon-link site-nav-mobile-close"
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="masthead-search mobile">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search guides"
                  aria-label="Search guides"
                  className="masthead-search-input"
                />
                <button type="submit" className="masthead-search-button">
                  <Search size={16} />
                  <span>Search</span>
                </button>
              </form>

              <div className="site-nav-mobile-links">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/about"
                  className={`nav-link ${isActive("/about") ? "nav-link-active" : ""}`}
                >
                  About
                </Link>
                <Link
                  href="/feedback"
                  className={`nav-link ${isActive("/feedback") ? "nav-link-active" : ""}`}
                >
                  Feedback
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
