import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/method", label: "Method" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="site-nav">
      <div className="site-container flex items-center justify-between py-4">
        <Link href="/" className="brand-mark">
          futile<span className="text-[var(--accent-strong)]">.</span>in
        </Link>

        <div className="hidden items-center gap-2 md:flex">
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

        <Link href="/categories" className="secondary-link hidden md:inline-flex">
          Browse guides
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="icon-link md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isOpen ? (
        <div className="site-container pb-4 md:hidden">
          <div className="card flex flex-col gap-2 p-3">
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
          </div>
        </div>
      ) : null}
    </nav>
  );
}
