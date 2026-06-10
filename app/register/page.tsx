"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { apiPost } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    confermaPassword: "",
    ruolo: "DIPENDENTE" as "DIPENDENTE" | "RESPONSABILE",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confermaPassword) {
      setError("Le password non coincidono");
      return;
    }
    setLoading(true);
    try {
      await apiPost("/api/auth/register", form);
      setSuccess("Registrazione completata. Puoi effettuare il login.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-bold">Registrati</h1>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nome</label>
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Cognome</label>
            <input
              required
              value={form.cognome}
              onChange={(e) => setForm({ ...form, cognome: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Conferma password
            </label>
            <input
              type="password"
              required
              value={form.confermaPassword}
              onChange={(e) =>
                setForm({ ...form, confermaPassword: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Ruolo</label>
            <select
              value={form.ruolo}
              onChange={(e) =>
                setForm({
                  ...form,
                  ruolo: e.target.value as "DIPENDENTE" | "RESPONSABILE",
                })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="DIPENDENTE">Dipendente</option>
              <option value="RESPONSABILE">Responsabile amministrativo</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Registrazione..." : "Registrati"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Hai già un account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
