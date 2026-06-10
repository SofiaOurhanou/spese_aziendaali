import { Prisma, Role, StatoRimborso } from "@prisma/client";
import { AuthUser } from "./auth";

export type RimborsoFilters = {
  stato?: StatoRimborso;
  categoriaId?: number;
  dipendenteId?: number;
  mese?: string;
};

function meseToDateRange(mese: string): { gte: Date; lt: Date } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(mese);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const gte = new Date(year, month, 1);
  const lt = new Date(year, month + 1, 1);
  return { gte, lt };
}

export function buildRimborsoWhere(
  filters: RimborsoFilters,
  user: AuthUser
): Prisma.RichiestaRimborsoWhereInput {
  const where: Prisma.RichiestaRimborsoWhereInput = {};

  if (user.ruolo === "DIPENDENTE") {
    where.dipendenteId = user.id;
  } else if (filters.dipendenteId) {
    where.dipendenteId = filters.dipendenteId;
  }

  if (filters.stato) where.stato = filters.stato;
  if (filters.categoriaId) where.categoriaId = filters.categoriaId;

  if (filters.mese) {
    const range = meseToDateRange(filters.mese);
    if (range) {
      where.dataSpesa = range;
    }
  }

  return where;
}

export function parseRimborsoFilters(
  searchParams: URLSearchParams
): RimborsoFilters {
  const filters: RimborsoFilters = {};

  const stato = searchParams.get("stato");
  if (
    stato &&
    ["IN_ATTESA", "APPROVATA", "RIFIUTATA", "LIQUIDATA"].includes(stato)
  ) {
    filters.stato = stato as StatoRimborso;
  }

  const categoriaId = searchParams.get("categoriaId");
  if (categoriaId) filters.categoriaId = parseInt(categoriaId, 10);

  const dipendenteId = searchParams.get("dipendenteId");
  if (dipendenteId) filters.dipendenteId = parseInt(dipendenteId, 10);

  const mese = searchParams.get("mese");
  if (mese) filters.mese = mese;

  return filters;
}

export function formatMese(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
