"use client";

import { FilmStrip, PlusCircle, Trophy } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: typeof FilmStrip;
}

const navItems: NavItem[] = [
  { href: "/movies", label: "Movies", icon: FilmStrip },
  { href: "/movies/add", label: "Add", icon: PlusCircle },
  { href: "/tournament", label: "Tournament", icon: Trophy },
];

interface NavProps {
  hasFinishedTournament?: boolean;
}

export function Nav({ hasFinishedTournament = false }: NavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background md:hidden">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/movies" &&
                pathname.startsWith("/movies") &&
                pathname !== "/movies/add") ||
              (item.href === "/tournament" && pathname.startsWith("/tournament"));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors",
                  isActive ? "text-amber-500" : "text-muted-foreground hover:text-foreground",
                )}
                href={item.href}
              >
                <Icon className="h-6 w-6" weight={isActive ? "fill" : "bold"} />
                <span>{item.label}</span>
                {item.href === "/tournament" && hasFinishedTournament && (
                  <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-amber-500" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop top nav */}
      <nav className="sticky top-0 z-50 hidden border-b border-border bg-background md:block">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link className="text-xl font-bold text-primary" href="/movies">
            Movie Chooser
          </Link>
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/movies" &&
                  pathname.startsWith("/movies") &&
                  pathname !== "/movies/add") ||
                (item.href === "/tournament" && pathname.startsWith("/tournament"));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  className={cn(
                    "relative flex items-center gap-2 text-sm font-medium transition-colors",
                    isActive ? "text-amber-500" : "text-muted-foreground hover:text-foreground",
                  )}
                  href={item.href}
                >
                  <Icon className="h-5 w-5" weight={isActive ? "fill" : "bold"} />
                  <span>{item.label}</span>
                  {item.href === "/tournament" && hasFinishedTournament && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-500" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
