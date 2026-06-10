# Gestione Rimborsi Spese Aziendali

Applicazione web full-stack per la gestione delle richieste di rimborso spese aziendali (prova pratica S5).

## Stack

- **Frontend**: Next.js 16 (App Router, CSR con Client Components)
- **Backend**: API REST Next.js Route Handlers
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (Bearer token)
- **Validazione**: Zod

## Avvio rapido

### 1. Dipendenze

```bash
npm install
```

### 2. Variabili d'ambiente

Copia `.env.example` in `.env` e configura:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/spese_aziendali"
DIRECT_URL="postgresql://user:password@localhost:5432/spese_aziendali"
JWT_SECRET="cambia-questo-segreto-in-produzione"
```

### 3. Database

```bash
npx prisma migrate deploy
npx prisma db seed
```

Per resettare il database in sviluppo:

```bash
npm run db:reset
```

### 4. Avvio applicazione

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Credenziali di test

Password per tutti gli utenti: `Password1!`

| Ruolo | Email |
|-------|-------|
| Responsabile amministrativo | responsabile@azienda.it |
| Dipendente | laura.bianchi@azienda.it |
| Dipendente | giuseppe.verdi@azienda.it |

## Funzionalità

### Dipendente
- Registrazione e login
- Creazione richieste di rimborso
- Visualizzazione, modifica ed eliminazione delle proprie richieste (solo in stato "In attesa")
- Filtri per stato, categoria e mese

### Responsabile amministrativo
- Visualizzazione di tutte le richieste
- Approvazione, rifiuto e liquidazione
- Statistiche aggregate per mese e categoria
- Filtri aggiuntivi per dipendente

## API

Tutte le API (eccetto login e register) richiedono header:

```
Authorization: Bearer <token>
```

### Autenticazione

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrazione utente |
| POST | `/api/auth/login` | Login (restituisce token JWT) |

### Categorie

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/categorie` | Elenco categorie spesa |

### Rimborsi

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/rimborsi` | Lista con filtri (`stato`, `categoriaId`, `mese`, `dipendenteId`) |
| POST | `/api/rimborsi` | Crea richiesta (solo dipendente) |
| GET | `/api/rimborsi/{id}` | Dettaglio |
| PUT | `/api/rimborsi/{id}` | Modifica (solo dipendente, solo IN_ATTESA) |
| DELETE | `/api/rimborsi/{id}` | Elimina (solo dipendente, solo IN_ATTESA) |
| PUT | `/api/rimborsi/{id}/approva` | Approva (solo responsabile) |
| PUT | `/api/rimborsi/{id}/rifiuta` | Rifiuta (solo responsabile) |
| PUT | `/api/rimborsi/{id}/liquida` | Liquida (solo responsabile) |

### Statistiche

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/statistiche/rimborsi` | Riepilogo per mese e categoria (solo responsabile) |

Query params: `mese` (YYYY-MM), `categoriaId`, `dipendenteId`

## Test API con Postman

Importa la collection in `docs/postman_collection.json`.

1. Esegui **Login** per ottenere il token
2. Copia il token nella variabile `token` della collection
3. Testa gli altri endpoint

## Struttura progetto

```
app/
  api/          # Route handlers API
  dashboard/    # Dashboard post-login
  login/        # Pagina login
  register/     # Pagina registrazione
  rimborsi/     # Gestione richieste
  statistiche/  # Riepilogo responsabile
components/     # Componenti UI riutilizzabili
lib/            # Auth, Prisma, helper API client
prisma/         # Schema e seed
schemas/        # Validazione Zod
docs/           # Postman collection
```
