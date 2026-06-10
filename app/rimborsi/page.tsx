"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  RimborsoFilters,
  FilterValues,
  buildQuery,
} from "@/components/RimborsoFilters";
import { Categoria } from "@/components/RimborsoForm";
import { apiGet, getUser, StoredUser } from "@/lib/api-client";
import { Rimborso } from "@/lib/types";
import { formatData, formatImporto, STATI_LABEL } from "@/lib/format";

const emptyFilters: FilterValues = {
  stato: "",
  categoriaId: "",
  mese: "",
  dipendenteId: "",
};

export default function RimborsiPage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [rimborsi, setRimborsi] = useState<Rimborso[]>([]);
  const [categorie, setCategorie] = useState<Categoria[]>([]);
  const [dipendenti, setDipendenti] = useState<
    Array<{ id: number; nome: string; cognome: string }>
  >([]);
  const [filters, setFilters] = useState<FilterValues>(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setUser(getUser());
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [r, c] = await Promise.all([
        apiGet<Rimborso[]>(`/api/rimborsi${buildQuery(filters)}`),
        apiGet<Categoria[]>("/api/categorie"),
      ]);
      setRimborsi(r);
      setCategorie(c);

      if (user?.ruolo === "RESPONSABILE") {
        const unique = new Map<number, { id: number; nome: string; cognome: string }>();
        for (const rim of r) {
          unique.set(rim.dipendente.id, rim.dipendente);
        }
        setDipendenti(Array.from(unique.values()));
      }
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }, [filters, user?.ruolo]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {user?.ruolo === "RESPONSABILE"
              ? "Tutte le richieste"
              : "Le mie richieste"}
          </h1>
          {user?.ruolo === "DIPENDENTE" && (
            <Link
              href="/rimborsi/nuovo"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Nuova richiesta
            </Link>
          )}
        </div>

        <RimborsoFilters
          values={filters}
          onChange={setFilters}
          categorie={categorie}
          showDipendente={user?.ruolo === "RESPONSABILE"}
          dipendenti={dipendenti}
        />

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : rimborsi.length === 0 ? (
          <p className="text-gray-600">Nessuna richiesta trovata.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3">Data spesa</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Importo</th>
                  <th className="px-4 py-3">Stato</th>
                  {user?.ruolo === "RESPONSABILE" && (
                    <th className="px-4 py-3">Dipendente</th>
                  )}
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {rimborsi.map((r) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{formatData(r.dataSpesa)}</td>
                    <td className="px-4 py-3">{r.categoria.descrizione}</td>
                    <td className="px-4 py-3">{formatImporto(r.importo)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                        {STATI_LABEL[r.stato]}
                      </span>
                    </td>
                    {user?.ruolo === "RESPONSABILE" && (
                      <td className="px-4 py-3">
                        {r.dipendente.nome} {r.dipendente.cognome}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <Link
                        href={`/rimborsi/${r.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Dettaglio
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
