"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { RimborsoForm, Categoria, RimborsoFormData } from "@/components/RimborsoForm";
import { apiGet, apiPut } from "@/lib/api-client";
import { Rimborso } from "@/lib/types";

function toDateInput(date: string) {
  return new Date(date).toISOString().split("T")[0];
}

export default function ModificaRimborsoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [rimborso, setRimborso] = useState<Rimborso | null>(null);
  const [categorie, setCategorie] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiGet<Rimborso>(`/api/rimborsi/${id}`),
      apiGet<Categoria[]>("/api/categorie"),
    ])
      .then(([r, c]) => {
        if (r.stato !== "IN_ATTESA") {
          setError("Solo le richieste in attesa possono essere modificate");
        }
        setRimborso(r);
        setCategorie(c);
      })
      .catch((err: { message?: string }) => {
        setError(err.message || "Errore nel caricamento");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(form: RimborsoFormData) {
    await apiPut(`/api/rimborsi/${id}`, {
      dataSpesa: form.dataSpesa,
      categoriaId: Number(form.categoriaId),
      importo: Number(form.importo),
      descrizione: form.descrizione,
      riferimentoGiustificativo: form.riferimentoGiustificativo || undefined,
    });
    router.push(`/rimborsi/${id}`);
  }

  return (
    <ProtectedRoute ruoli={["DIPENDENTE"]}>
      <AppShell>
        <Link
          href={`/rimborsi/${id}`}
          className="mb-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Torna al dettaglio
        </Link>
        <h1 className="mb-6 text-2xl font-bold">Modifica richiesta</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : rimborso && rimborso.stato === "IN_ATTESA" ? (
          <RimborsoForm
            categorie={categorie}
            initial={{
              dataSpesa: toDateInput(rimborso.dataSpesa),
              categoriaId: String(rimborso.categoria.id),
              importo: String(rimborso.importo),
              descrizione: rimborso.descrizione,
              riferimentoGiustificativo: rimborso.riferimentoGiustificativo ?? "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Salva modifiche"
          />
        ) : null}
      </AppShell>
    </ProtectedRoute>
  );
}
