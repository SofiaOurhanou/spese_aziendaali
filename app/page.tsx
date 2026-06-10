import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Gestione Rimborsi Spese Aziendali
        </h1>
        <p className="mb-8 text-gray-600">
          Inserisci, approva e monitora le richieste di rimborso spese
          aziendali. Accedi con le tue credenziali o registrati come nuovo
          dipendente.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Accedi
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 hover:bg-gray-50"
          >
            Registrati
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
