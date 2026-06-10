"use client";

import { useState } from "react";

export type Categoria = { id: number; descrizione: string };

export type RimborsoFormData = {
  dataSpesa: string;
  categoriaId: string;
  importo: string;
  descrizione: string;
  riferimentoGiustificativo: string;
};

type Props = {
  categorie: Categoria[];
  initial?: Partial<RimborsoFormData>;
  onSubmit: (data: RimborsoFormData) => Promise<void>;
  submitLabel: string;
};

export function RimborsoForm({
  categorie,
  initial,
  onSubmit,
  submitLabel,
}: Props) {
  const [form, setForm] = useState<RimborsoFormData>({
    dataSpesa: initial?.dataSpesa ?? "",
    categoriaId: initial?.categoriaId ?? "",
    importo: initial?.importo ?? "",
    descrizione: initial?.descrizione ?? "",
    riferimentoGiustificativo: initial?.riferimentoGiustificativo ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Errore durante il salvataggio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium">Data spesa</label>
        <input
          type="date"
          required
          value={form.dataSpesa}
          onChange={(e) => setForm({ ...form, dataSpesa: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Categoria</label>
        <select
          required
          value={form.categoriaId}
          onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Seleziona categoria</option>
          {categorie.map((c) => (
            <option key={c.id} value={c.id}>
              {c.descrizione}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Importo (€)</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          required
          value={form.importo}
          onChange={(e) => setForm({ ...form, importo: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Descrizione</label>
        <textarea
          required
          rows={3}
          value={form.descrizione}
          onChange={(e) => setForm({ ...form, descrizione: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Riferimento giustificativo (opzionale)
        </label>
        <input
          type="text"
          value={form.riferimentoGiustificativo}
          onChange={(e) =>
            setForm({ ...form, riferimentoGiustificativo: e.target.value })
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Salvataggio..." : submitLabel}
      </button>
    </form>
  );
}
