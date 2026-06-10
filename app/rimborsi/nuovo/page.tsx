"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { RimborsoForm, Categoria, RimborsoFormData } from "@/components/RimborsoForm";
import { apiGet, apiPost } from "@/lib/api-client";

export default function NuovoRimborsoPage() {
  const router = useRouter();
  const [categorie, setCategorie] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Categoria[]>("/api/categorie")
      .then(setCategorie)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(form: RimborsoFormData) {
    await apiPost("/api/rimborsi", {
      dataSpesa: form.dataSpesa,
      categoriaId: Number(form.categoriaId),
      importo: Number(form.importo),
      descrizione: form.descrizione,
      riferimentoGiustificativo: form.riferimentoGiustificativo || undefined,
    });
    router.push("/rimborsi");
  }

  return (
    <ProtectedRoute ruoli={["DIPENDENTE"]}>
      <AppShell>
        <h1 className="mb-6 text-2xl font-bold">Nuova richiesta di rimborso</h1>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <RimborsoForm
            categorie={categorie}
            onSubmit={handleSubmit}
            submitLabel="Crea richiesta"
          />
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
