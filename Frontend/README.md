# Boekenwinkel frontend

De frontend van Boekenwinkel is een single-page applicatie gebouwd met React, TypeScript en Vite. De UI gebruikt React Router voor navigatie, TanStack React Query voor server-state en Tailwind CSS voor styling.

## Vereisten

- Node.js 20.19+ of 22.12+
- npm
- De Boekenwinkel-backend, standaard bereikbaar op `http://localhost:8080`

## Installeren en starten

Voer vanuit deze map uit:

```bash
npm ci
npm run dev
```

Vite toont de lokale URL in de terminal, standaard `http://localhost:5173`. In development worden aanvragen op `/api` doorgestuurd naar de backend op poort `8080`; het prefix `/api` wordt daarbij verwijderd.

Voor een andere API-basis-URL maak je lokaal een `.env`-bestand aan met:

```dotenv
VITE_API_URL=http://localhost:8080
```

Commit geen `.env`-bestanden of geheimen.

## Scripts

| Commando | Beschrijving |
| --- | --- |
| `npm run dev` | Start de Vite-ontwikkelserver |
| `npm run build` | Typecheckt en maakt een productiebuild |
| `npm run preview` | Serveert de productiebuild lokaal |
| `npm run lint` | Voert ESLint uit |

## API-endpoints

De frontend gebruikt de REST API van de backend voor authenticatie, boeken, auteurs, recensies, reserveringen, reserveringsitems en gebruikersbeheer. De volledige endpointcatalogus — inclusief HTTP-methoden, rollen, requestvoorbeelden en responses — staat in de [API-documentatie in de project-README](../README.md#rest-api).

## Belangrijkste dependencies

- `react` en `react-dom`: UI-framework.
- `react-router-dom`: client-side routes.
- `@tanstack/react-query`: ophalen, cachen en muteren van serverdata.
- `tailwindcss` en `@tailwindcss/vite`: styling en Vite-integratie.
- `vite` en `@vitejs/plugin-react`: development server en build tooling.
- `typescript`: statische typecontrole.
- `eslint` en de React/TypeScript ESLint-plugins: linting.
