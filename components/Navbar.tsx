"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAuth, getUser, StoredUser } from "@/lib/api-client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  function logout() {
    clearAuth();
    router.push("/login");
  }

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname === href
        ? "bg-blue-100 text-blue-800"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={user ? "/dashboard" : "/"} className="text-lg font-semibold text-blue-700">
          Rimborsi Spese
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link href="/rimborsi" className={linkClass("/rimborsi")}>
                {user.ruolo === "RESPONSABILE" ? "Richieste" : "Le mie richieste"}
              </Link>
              {user.ruolo === "DIPENDENTE" && (
                <Link href="/rimborsi/nuovo" className={linkClass("/rimborsi/nuovo")}>
                  Nuova richiesta
                </Link>
              )}
              {user.ruolo === "RESPONSABILE" && (
                <Link href="/statistiche" className={linkClass("/statistiche")}>
                  Statistiche
                </Link>
              )}
              <span className="ml-2 text-sm text-gray-600">
                {user.nome} {user.cognome}
              </span>
              <button
                onClick={logout}
                className="rounded-md bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300"
              >
                Esci
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>
              <Link href="/register" className={linkClass("/register")}>
                Registrati
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
