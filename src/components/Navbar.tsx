"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/cart", label: "Cart" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          ECOM
        </Link>

        <div className="flex items-center gap-6 text-sm">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive ? "text-black" : "text-zinc-500 hover:text-black"
                }`}
              >
                {link.label}
                {link.href === "/cart" && cartCount > 0 ? (
                  <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-xs text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
