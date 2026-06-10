"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  RimborsoFilters,
  FilterValues,
  buildQuery,
} from "@/components/RimborsoFilters";
import { Categoria } from "@/components/RimborsoForm";
import { apiGet } from "@/lib/api-client";
import { Rimborso, StatisticaRimborso } from "@/lib/types";
import { formatImporto } from "@/lib/format";

const emptyFilters: FilterValues = {
  stato: "",
  categoriaId: "",
  mese: "",
  dipendenteId: "",
};

export default function StatistichePage() {
  const [stats, setStats] = useState<StatisticaRimborso[]>([]);
  const [categorie, setCategorie] = useState<Categoria[]>([]);
  const [dipendenti, setDipendenti] = useState<
    Array<{ id: number; nome: string; cognome: string }>
  >([]);
  const [filters, setFilters] = useState<FilterValues>(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = buildQuery(filters);
      const [s, c, r] = await Promise.all([
        apiGet<StatisticaRimborso[]>(`/api/statistiche/rimborsi${query}`),
        apiGet<Categoria[]>("/api/categorie"),
        apiGet<Rimborso[]>("/api/rimborsi"),
      ]);
      setStats(s);
      setCategorie(c);
      const unique = new Map<number, { id: number; nome: string; cognome: string }>();
      for (const rim of r) {
        unique.set(rim.dipendente.id, rim.dipendente);
      }
      setDipendenti(Array.from(unique.values()));
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ProtectedRoute ruoli={["RESPONSABILE"]}>
      <AppShell>
        <h1 className="mb-6 text-2xl font-bold">Statistiche rimborsi</h1>
        <p className="mb-6 text-gray-600">
          Riepilogo aggregato per mese e categoria
        </p>

        <RimborsoFilters
          values={filters}
          onChange={setFilters}
          categorie={categorie}
          showDipendente
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
        ) : stats.length === 0 ? (
          <p className="text-gray-600">Nessun dato disponibile.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3">Mese</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">N. richieste</th>
                  <th className="px-4 py-3">Totale richiesto</th>
                  <th className="px-4 py-3">Totale approvato</th>
                  <th className="px-4 py-3">Totale liquidato</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-3">{s.mese}</td>
                    <td className="px-4 py-3">{s.categoria}</td>
                    <td className="px-4 py-3">{s.numeroRichieste}</td>
                    <td className="px-4 py-3">{formatImporto(s.totaleRichiesto)}</td>
                    <td className="px-4 py-3">{formatImporto(s.totaleApprovato)}</td>
                    <td className="px-4 py-3">{formatImporto(s.totaleLiquidato)}</td>
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
