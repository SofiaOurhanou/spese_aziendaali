"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { apiPost, setToken, setUser } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiPost<{
        token: string;
        user: { id: number; nome: string; cognome: string; email: string; ruolo: "DIPENDENTE" | "RESPONSABILE" };
      }>("/api/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Credenziali errate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-bold">Accedi</h1>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Non hai un account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Registrati
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
