import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [location, navigate] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/channels", label: "Channels" },
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

          <Link
            href="/about"
            className={`nav-link hidden md:inline-flex ${
              isActive("/about") ? "nav-link-active" : ""
            }`}
          >
            About
          </Link>
        </div>
      </div>

      {isOpen ? (
        <div className="site-container site-nav-mobile md:hidden">
          <div className="card flex flex-col gap-3 p-4">
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

            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/about"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
