"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MessageBanner } from "@/components/MessageBanner";
import { apiDelete, apiGet, apiPut, getUser, StoredUser } from "@/lib/api-client";
import { Rimborso } from "@/lib/types";
import { formatData, formatImporto, STATI_LABEL } from "@/lib/format";

export default function RimborsoDettaglioPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [user, setUser] = useState<StoredUser | null>(null);
  const [rimborso, setRimborso] = useState<Rimborso | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [motivazione, setMotivazione] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await apiGet<Rimborso>(`/api/rimborsi/${id}`);
      setRimborso(data);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setMessage({ type: "error", text: apiErr.message || "Errore" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDelete() {
    if (!confirm("Eliminare questa richiesta?")) return;
    setActionLoading(true);
    try {
      await apiDelete(`/api/rimborsi/${id}`);
      router.push("/rimborsi");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setMessage({ type: "error", text: apiErr.message || "Errore" });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleApprova() {
    setActionLoading(true);
    setMessage(null);
    try {
      const updated = await apiPut<Rimborso>(`/api/rimborsi/${id}/approva`);
      setRimborso(updated);
      setMessage({ type: "success", text: "Richiesta approvata" });
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setMessage({ type: "error", text: apiErr.message || "Errore" });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRifiuta() {
    setActionLoading(true);
    setMessage(null);
    try {
      const updated = await apiPut<Rimborso>(`/api/rimborsi/${id}/rifiuta`, {
        motivazioneRifiuto: motivazione || undefined,
      });
      setRimborso(updated);
      setMessage({ type: "success", text: "Richiesta rifiutata" });
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setMessage({ type: "error", text: apiErr.message || "Errore" });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLiquida() {
    setActionLoading(true);
    setMessage(null);
    try {
      const updated = await apiPut<Rimborso>(`/api/rimborsi/${id}/liquida`);
      setRimborso(updated);
      setMessage({ type: "success", text: "Rimborso liquidato" });
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setMessage({ type: "error", text: apiErr.message || "Errore" });
    } finally {
      setActionLoading(false);
    }
  }

  const isOwner = rimborso && user?.id === rimborso.dipendente.id;
  const isResponsabile = user?.ruolo === "RESPONSABILE";

  return (
    <ProtectedRoute>
      <AppShell>
        <Link href="/rimborsi" className="mb-4 inline-block text-sm text-blue-600 hover:underline">
          ← Torna all&apos;elenco
        </Link>

        {message && <MessageBanner type={message.type} message={message.text} />}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : !rimborso ? (
          <p>Richiesta non trovata.</p>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-start justify-between">
              <h1 className="text-2xl font-bold">Richiesta #{rimborso.id}</h1>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {STATI_LABEL[rimborso.stato]}
              </span>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">Data spesa</dt>
                <dd className="font-medium">{formatData(rimborso.dataSpesa)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Categoria</dt>
                <dd className="font-medium">{rimborso.categoria.descrizione}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Importo</dt>
                <dd className="font-medium">{formatImporto(rimborso.importo)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Dipendente</dt>
                <dd className="font-medium">
                  {rimborso.dipendente.nome} {rimborso.dipendente.cognome}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-gray-500">Descrizione</dt>
                <dd className="font-medium">{rimborso.descrizione}</dd>
              </div>
              {rimborso.riferimentoGiustificativo && (
                <div className="sm:col-span-2">
                  <dt className="text-sm text-gray-500">Giustificativo</dt>
                  <dd className="font-medium">{rimborso.riferimentoGiustificativo}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-500">Data valutazione</dt>
                <dd className="font-medium">{formatData(rimborso.dataValutazione)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Data liquidazione</dt>
                <dd className="font-medium">{formatData(rimborso.dataLiquidazione)}</dd>
              </div>
              {rimborso.motivazioneRifiuto && (
                <div className="sm:col-span-2">
                  <dt className="text-sm text-gray-500">Motivazione rifiuto</dt>
                  <dd className="font-medium text-red-700">{rimborso.motivazioneRifiuto}</dd>
                </div>
              )}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              {isOwner && rimborso.stato === "IN_ATTESA" && (
                <>
                  <Link
                    href={`/rimborsi/${id}/modifica`}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Modifica
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Elimina
                  </button>
                </>
              )}

              {isResponsabile && rimborso.stato === "IN_ATTESA" && (
                <>
                  <button
                    onClick={handleApprova}
                    disabled={actionLoading}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Approva
                  </button>
                  <div className="flex w-full flex-wrap items-end gap-2 sm:w-auto">
                    <div>
                      <label className="mb-1 block text-xs text-gray-500">
                        Motivazione rifiuto (opzionale)
                      </label>
                      <input
                        type="text"
                        value={motivazione}
                        onChange={(e) => setMotivazione(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <button
                      onClick={handleRifiuta}
                      disabled={actionLoading}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Rifiuta
                    </button>
                  </div>
                </>
              )}

              {isResponsabile && rimborso.stato === "APPROVATA" && (
                <button
                  onClick={handleLiquida}
                  disabled={actionLoading}
                  className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  Registra liquidazione
                </button>
              )}
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
