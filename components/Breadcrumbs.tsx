"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  breads: "Breads",
  pastries: "Pastries",
  delivery: "Delivery Area",
  about: "About",
  community: "Community",
  faq: "FAQ",
  contact: "Contact",
  wholesale: "Wholesale Inquiry",
  burgers: "Burgers & Sliders",
  sandwiches: "Sandwiches & Subs",
  breakfast: "Coffee & Breakfast",
  dinner: "Dinner & Catering",
  restaurants: "Restaurants & Pubs",
  cafes: "Cafés & Coffee Shops",
  hotels: "Hotels",
  institutions: "Institutions",
};

export function Breadcrumbs() {
  const path = usePathname();
  if (!path || path === "/") return null;
  const parts = path.split("/").filter(Boolean);
  const final = parts[parts.length - 1];
  const title = labels[final] ?? final.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return (
    <nav className="site-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link href="/">Home</Link></li>
        <li aria-current="page">{title}</li>
      </ol>
    </nav>
  );
}
