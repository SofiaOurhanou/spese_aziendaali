export const STATI_LABEL: Record<string, string> = {
  IN_ATTESA: "In attesa",
  APPROVATA: "Approvata",
  RIFIUTATA: "Rifiutata",
  LIQUIDATA: "Liquidata",
};

export function formatData(date: string | Date | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("it-IT");
}

export function formatImporto(value: number | string) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value));
}
