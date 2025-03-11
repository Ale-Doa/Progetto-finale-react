# Sistema di Gestione Palestra

Un'applicazione web moderna per la gestione degli abbonamenti e delle prenotazioni di corsi in palestra, costruita con React e Node.js.

## Funzionalità

- **Autenticazione Utente**
  - Registrazione e login sicuri
  - Autenticazione basata su JWT
  - Controllo accessi basato su ruoli

- **Gestione Abbonamenti**
  - Diversi livelli di abbonamento (Base, Premium1, Premium3, Premium6, Premium12)
  - Calcolo automatico della data di scadenza
  - Monitoraggio dello stato dell'abbonamento

- **Sistema di Prenotazione**
  - Programmazione e prenotazione dei corsi
  - Verifica della disponibilità in tempo reale
  - Gestione delle prenotazioni per gli utenti
  - Funzionalità di cancellazione

- **Pannello di Amministrazione**
  - Gestione utenti
  - Modifica degli abbonamenti
  - Gestione delle date di inizio
  - Panoramica utenti con informazioni dettagliate

## Stack Tecnologico

### Frontend
- React
- React Router DOM
- Axios
- JWT Decode
- Vite

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Bcrypt

## Per Iniziare

### Prerequisiti
- Node.js (v14 o superiore)
- MongoDB
- Git

### Installazione

1. Clona il repository
```bash
git clone https://github.com/Ale-Doa/Progetto-finale-react.git
cd Progetto-finale-react
```
2. Installa le Dipendenze Backend
```bash
cd backend
npm install	
```
3. Configura le Variabili d'Ambiente. Crea un file .env nella directory backend:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gym-app
JWT_SECRET=your_jwt_secret_key
```
4. Installa le Dipendenze Frontend
```bash
cd ../frontend
npm install
```

### Esecuzione dell'Applicazione

1. Avvia il Server Backend
```bash
cd backend
npm run dev
```
2. Avvia il Server di Sviluppo Frontend
```bash	
cd frontend
npm run dev
```
L'applicazione sarà disponibile all'indirizzo http://localhost:5173

### Struttura del Progetto

```
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── screens/
    │   ├── services/
    │   └── App.jsx
    └── index.html
```

### Schema Colori

- Colore Scuro Primario: #242424
- Colore Accento: #32CD32
- Colore Errore: #F44336

### License

Questo progetto è concesso in licenza secondo i termini della Licenza MIT.