import { prisma } from "@/lib/prisma";
import { requireAuth, isAuthResponse } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (isAuthResponse(auth)) return auth;

  const categorie = await prisma.categoriaSpesa.findMany({
    orderBy: { descrizione: "asc" },
  });

  return NextResponse.json(categorie);
}
