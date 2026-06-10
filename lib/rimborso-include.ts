export const rimborsoInclude = {
  categoria: true,
  dipendente: {
    select: { id: true, nome: true, cognome: true, email: true },
  },
  responsabileValutazione: {
    select: { id: true, nome: true, cognome: true, email: true },
  },
} as const;
