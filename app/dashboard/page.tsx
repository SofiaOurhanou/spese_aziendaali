"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getUser, StoredUser } from "@/lib/api-client";

export default function DashboardPage() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <ProtectedRoute>
      <AppShell>
        <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
        {user && (
          <p className="mb-8 text-gray-600">
            Benvenuto, {user.nome} {user.cognome} ({user.ruolo === "RESPONSABILE" ? "Responsabile" : "Dipendente"})
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/rimborsi"
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300"
          >
            <h2 className="mb-2 font-semibold">
              {user?.ruolo === "RESPONSABILE"
                ? "Tutte le richieste"
                : "Le mie richieste"}
            </h2>
            <p className="text-sm text-gray-600">
              Visualizza e filtra le richieste di rimborso
            </p>
          </Link>
          {user?.ruolo === "DIPENDENTE" && (
            <Link
              href="/rimborsi/nuovo"
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300"
            >
              <h2 className="mb-2 font-semibold">Nuova richiesta</h2>
              <p className="text-sm text-gray-600">
                Inserisci una nuova richiesta di rimborso
              </p>
            </Link>
          )}
          {user?.ruolo === "RESPONSABILE" && (
            <Link
              href="/statistiche"
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300"
            >
              <h2 className="mb-2 font-semibold">Statistiche</h2>
              <p className="text-sm text-gray-600">
                Riepilogo per mese e categoria
              </p>
            </Link>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
