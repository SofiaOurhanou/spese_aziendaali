"use client";

import { Categoria } from "./RimborsoForm";

export type FilterValues = {
  stato: string;
  categoriaId: string;
  mese: string;
  dipendenteId: string;
};

type Dipendente = { id: number; nome: string; cognome: string };

type Props = {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  categorie: Categoria[];
  showDipendente?: boolean;
  dipendenti?: Dipendente[];
};

export function RimborsoFilters({
  values,
  onChange,
  categorie,
  showDipendente,
  dipendenti = [],
}: Props) {
  function update(field: keyof FilterValues, value: string) {
    onChange({ ...values, [field]: value });
  }

  return (
    <div className="mb-6 grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Stato</label>
        <select
          value={values.stato}
          onChange={(e) => update("stato", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Tutti</option>
          <option value="IN_ATTESA">In attesa</option>
          <option value="APPROVATA">Approvata</option>
          <option value="RIFIUTATA">Rifiutata</option>
          <option value="LIQUIDATA">Liquidata</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Categoria</label>
        <select
          value={values.categoriaId}
          onChange={(e) => update("categoriaId", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Tutte</option>
          {categorie.map((c) => (
            <option key={c.id} value={c.id}>
              {c.descrizione}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Mese</label>
        <input
          type="month"
          value={values.mese}
          onChange={(e) => update("mese", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      {showDipendente && (
        <div>
          <label className="mb-1 block text-sm font-medium">Dipendente</label>
          <select
            value={values.dipendenteId}
            onChange={(e) => update("dipendenteId", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Tutti</option>
            {dipendenti.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome} {d.cognome}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export function buildQuery(filters: FilterValues) {
  const params = new URLSearchParams();
  if (filters.stato) params.set("stato", filters.stato);
  if (filters.categoriaId) params.set("categoriaId", filters.categoriaId);
  if (filters.mese) params.set("mese", filters.mese);
  if (filters.dipendenteId) params.set("dipendenteId", filters.dipendenteId);
  const q = params.toString();
  return q ? `?${q}` : "";
}
