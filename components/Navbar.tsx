"use client";
import { logout } from "@/lib/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/jobs/post", label: "Post a Job" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-[rgba(243,239,232,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[color:var(--border)] bg-white/80 shadow-sm">
            <Image src="/logo.png" alt="Staffio Logo" width={28} height={28} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl text-[color:var(--accent-strong)]">
              Staffio
            </span>
            <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Hiring with restraint
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-[color:var(--accent-strong)] text-white shadow-sm"
                  : "text-[color:var(--muted)] hover:bg-white/80 hover:text-[color:var(--foreground)]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {session ? (
            <button
              onClick={() => logout()}
              className="rounded-full border border-[color:var(--border)] bg-white/70 px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:bg-white"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-full border border-[color:var(--accent-strong)] bg-[color:var(--accent-strong)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[color:var(--accent)]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
