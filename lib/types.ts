export type Rimborso = {
  id: number;
  dataInserimento: string;
  dataSpesa: string;
  importo: string | number;
  descrizione: string;
  riferimentoGiustificativo: string | null;
  stato: "IN_ATTESA" | "APPROVATA" | "RIFIUTATA" | "LIQUIDATA";
  dataValutazione: string | null;
  dataLiquidazione: string | null;
  motivazioneRifiuto: string | null;
  categoria: { id: number; descrizione: string };
  dipendente: { id: number; nome: string; cognome: string; email: string };
  responsabileValutazione?: {
    id: number;
    nome: string;
    cognome: string;
    email: string;
  } | null;
};

export type StatisticaRimborso = {
  mese: string;
  categoria: string;
  numeroRichieste: number;
  totaleRichiesto: number;
  totaleApprovato: number;
  totaleLiquidato: number;
};
