# Boekenwinkel

Boekenwinkel is een webapplicatie voor het bekijken en beheren van boeken en auteurs. Bezoekers kunnen boeken, auteurs en recensies bekijken; geregistreerde gebruikers kunnen inloggen en reserveringen beheren. Beheerders hebben daarnaast toegang tot beheerfuncties voor onder andere boeken, auteurs en gebruikers.

De applicatie bestaat uit een React-frontend en een Java/Spring Boot-backend. De backend biedt een REST API en gebruikt MySQL voor persistente gegevensopslag.

## Functionaliteit

- Boeken en auteurs bekijken, met detailpagina's.
- Boeken en auteurs aanmaken, bewerken en verwijderen als beheerder.
- Registreren, inloggen en de ingelogde gebruiker ophalen.
- Recensies bekijken en, met de juiste rol, beheren.
- Reserveringen bekijken en beheren; beheerders kunnen reserveringsstatussen aanpassen.
- Gebruikers beheren en rollen aanpassen als beheerder.
- API-documentatie via Springdoc OpenAPI / Swagger UI.

De toegang tot pagina's en API-functies is afhankelijk van de rol van de gebruiker. De backend gebruikt JWT-tokens voor authenticatie.

## Technologieën

| Onderdeel | Technologie |
| --- | --- |
| Frontend | React 19, TypeScript 6 |
| Frontend tooling | Vite 8, ESLint 10 |
| Styling | Tailwind CSS 4 |
| Navigatie | React Router 7 |
| Server-state en caching | TanStack React Query 5 |
| Backend | Java 25, Spring Boot 4.1 |
| REST API | Spring Web MVC |
| Persistence | Spring Data JPA, Hibernate |
| Validatie | Jakarta Bean Validation / Hibernate Validator |
| Authenticatie en autorisatie | Spring Security, JWT (JJWT), BCrypt |
| Database | MySQL |
| Testen | Spring Boot Test, JUnit Jupiter en Testcontainers |
| API-documentatie | Springdoc OpenAPI 3 |

## Projectstructuur

```text
.
├── Backend/              # Spring Boot REST API en Maven-project
│   ├── src/main/java/    # Controllers, services, repositories, modellen en beveiliging
│   └── src/test/java/    # Backendtests
├── Frontend/             # React- en TypeScript-applicatie
│   └── src/
│       ├── api/          # API-client en API-functies
│       ├── components/   # Gedeelde UI-componenten
│       ├── context/      # Applicatiebrede state en providers
│       ├── hooks/        # React Query-hooks
│       └── pages/        # Pagina's en routes
└── README.md
```

## Benodigdheden

- Java 25
- Node.js 20.19+ of 22.12+, met npm
- MySQL-server
- Docker, als je de backendtests uitvoert die Testcontainers gebruiken

## Installatie en lokaal starten

### 1. Database instellen

Start MySQL en maak de database aan:

```sql
CREATE DATABASE boekenwinkel;
```

Controleer de datasource-instellingen in `Backend/src/main/resources/application.properties`. De standaarddatabase-URL wijst naar `localhost:3306/boekenwinkel`. Stel daar de juiste databasegebruiker en het wachtwoord voor jouw omgeving in. De backend gebruikt Hibernate `ddl-auto=update` om het databaseschema bij het starten bij te werken.

De JWT-sleutel staat ook in de backendconfiguratie. Vervang de lokale waarde door een eigen, veilige sleutel voor je omgeving en gebruik nooit een ontwikkelsleutel in productie. Commit geen wachtwoorden, tokens of andere geheimen.

### 2. Backend starten

Voer vanuit de projectmap uit:

```powershell
cd Backend
.\mvnw.cmd spring-boot:run
```

Op macOS of Linux:

```bash
cd Backend
./mvnw spring-boot:run
```

De backend luistert standaard op `http://localhost:8080`.

### 3. Frontend starten

Open een tweede terminal:

```powershell
cd Frontend
npm ci
npm run dev
```

Open de lokale URL die Vite in de terminal toont (standaard `http://localhost:5173`).

Tijdens lokale ontwikkeling stuurt Vite aanvragen op `/api` door naar `http://localhost:8080` en verwijdert het proxy-prefix `/api`. De frontend gebruikt standaard `/api` als API-basisadres. Als je een andere API-URL nodig hebt, stel dan `VITE_API_URL` in, bijvoorbeeld in een lokaal `Frontend/.env`-bestand:

```dotenv
VITE_API_URL=http://localhost:8080
```

Het `.env`-bestand is lokaal en hoort niet in versiebeheer.

## REST API

De backend luistert standaard op `http://localhost:8080`. De Vite-ontwikkelserver stuurt aanvragen onder `/api` door naar de backend en verwijdert dat prefix. Bijvoorbeeld: `GET http://localhost:8080/books` is tijdens frontendontwikkeling bereikbaar als `GET http://localhost:5173/api/books`.

Alle endpoints met een request body verwachten JSON (`Content-Type: application/json`). Beschermde endpoints verwachten het JWT uit `/auth/signin` in de `Authorization: Bearer <token>`-header. `{id}` is een UUID; `{isbn}` is de ISBN-string van een boek. De backend bepaalt de exacte foutstatus en foutmelding voor ongeldige invoer, niet-bestaande records en geweigerde toegang.

### Authenticatie

| Methode en endpoint | Toegang | Request | Succesresponse |
| --- | --- | --- | --- |
| `POST /auth/signup` | Publiek | `{"email":"ada@example.com","passwordHash":"voorbeeld-wachtwoord","firstName":"Ada","lastName":"Lovelace"}` | `200`, tekst `User registered successfully` |
| `POST /auth/signin` | Publiek | `{"email":"ada@example.com","passwordHash":"voorbeeld-wachtwoord"}` | `200`, JWT als tekst |
| `GET /auth/me` | Ingelogde gebruiker | Geen | `200`, gebruiker: `id`, `email`, `firstName`, `lastName`, `roles` |

> De huidige auth-controller leest bij aanmelden en registreren het wachtwoord uit het veld `passwordHash`. Dit is de veldnaam van de API-request; stuur een normaal wachtwoord als waarde, geen vooraf gehashte waarde.

### Boeken

| Methode en endpoint | Toegang | Request | Succesresponse |
| --- | --- | --- | --- |
| `GET /books` | Publiek | Geen | `200`, lijst van boeken |
| `GET /books/{isbn}` | Publiek | ISBN in het pad | `200`, boek |
| `POST /books` | `ADMIN` | Boekobject | `201`, aangemaakt boek |
| `PUT /books` | `ADMIN` | Boekobject inclusief ISBN | `200`, bijgewerkt boek |
| `DELETE /books/{isbn}` | `ADMIN` | ISBN in het pad | `200`, tekst `Delete book successfully` |

Boekobject voor `POST` en `PUT`:

```json
{
  "isbn": "978-0000000001",
  "title": "Voorbeeldboek",
  "description": "Een korte beschrijving",
  "price": 19.95,
  "stock": 10,
  "authorId": "00000000-0000-0000-0000-000000000001"
}
```

Een boekresponse bevat `isbn`, `title`, `description`, `price`, `stock`, `authorFirstName` en `authorLastName`.

### Auteurs

| Methode en endpoint | Toegang | Request | Succesresponse |
| --- | --- | --- | --- |
| `GET /authors` | Publiek | Geen | `200`, lijst van auteurs |
| `GET /authors/{id}` | Publiek | UUID in het pad | `200`, auteur |
| `POST /authors` | `ADMIN` | `{"firstName":"Ada","lastName":"Lovelace"}` | `201`, aangemaakte auteur |
| `PUT /authors/{id}` | `ADMIN` | `{"firstName":"Ada","lastName":"Byron"}` | `200`, bijgewerkte auteur |
| `DELETE /authors/{id}` | `ADMIN` | UUID in het pad | `200`, tekst `Deleted author successfully` |

Een auteurresponse bevat `id`, `firstName` en `lastName`.

### Recensies

| Methode en endpoint | Toegang | Request | Succesresponse |
| --- | --- | --- | --- |
| `GET /reviews` | Publiek | Geen | `200`, lijst van recensies |
| `GET /reviews/{id}` | Publiek | UUID in het pad | `200`, recensie |
| `POST /reviews?isbn={isbn}` | `USER` of `ADMIN` | Recensieobject | `201`, aangemaakte recensie |
| `DELETE /reviews/{id}` | `USER` of `ADMIN` | UUID in het pad | `200`, tekst `Review deleted successfully` |

Request voor `POST /reviews`:

```json
{
  "bookIsbn": "978-0000000001",
  "score": 5,
  "text": "Een aanrader."
}
```

De queryparameter `isbn` is vereist. `score` moet tussen 1 en 5 liggen; `text` is optioneel. De response bevat `id`, `score`, `text`, `createdAt`, `email` en `isbn`.

### Reserveringen

| Methode en endpoint | Toegang | Request | Succesresponse |
| --- | --- | --- | --- |
| `GET /reservations` | `USER` of `ADMIN` | Geen | `200`, lijst van reserveringen |
| `GET /reservations/{id}` | `USER` of `ADMIN` | UUID in het pad | `200`, reservering |
| `POST /reservations` | `USER` of `ADMIN` | Reservering met minimaal één item | `201`, aangemaakte reservering |
| `PUT /reservations/{id}/status` | `ADMIN` | `{"status":"CONFIRMED"}` of `{"status":"CANCELED"}` | `200`, bijgewerkte reservering |
| `DELETE /reservations/{id}` | `USER` of `ADMIN` | UUID in het pad | `200`, tekst `Deleted reservation successfully` |

Request voor `POST /reservations`:

```json
{
  "items": [
    {
      "isbn": "978-0000000001",
      "quantity": 2
    }
  ]
}
```

Elk item heeft een ISBN en een positieve `quantity`. Een reserveringresponse bevat `id`, `status`, `createdAt`, `confirmedAt`, `userFirstName`, `userLastName` en `items`. Elk reserveringsitem bevat `id`, `isbn`, `quantity` en `priceAtReservation`.

### Reserveringsitems

| Methode en endpoint | Toegang | Request | Succesresponse |
| --- | --- | --- | --- |
| `GET /reservation_items` | `ADMIN` | Geen | `200`, lijst van reserveringsitems |
| `GET /reservation_items/{id}` | `ADMIN` | UUID in het pad | `200`, reserveringsitem |
| `PUT /reservation_items/{id}` | `ADMIN` | `{"isbn":"978-0000000001","quantity":2}` | `200`, bijgewerkt reserveringsitem |
| `DELETE /reservation_items/{id}` | `ADMIN` | UUID in het pad | `200`, tekst `Reservation item deleted successfully` |

Een reserveringsitemresponse bevat `id`, `isbn`, `quantity` en `priceAtReservation`.

### Gebruikersbeheer

Alle `/users`-endpoints vereisen de rol `ADMIN`.

| Methode en endpoint | Request | Succesresponse |
| --- | --- | --- |
| `GET /users` | Geen | `200`, lijst van gebruikers |
| `GET /users/{id}` | UUID in het pad | `200`, gebruiker |
| `POST /users` | `{"email":"ada@example.com","password":"voorbeeld-wachtwoord","firstName":"Ada","lastName":"Lovelace"}` | `201`, aangemaakte gebruiker |
| `PUT /users/{id}` | `{"email":"ada@example.com","firstName":"Ada","lastName":"Byron"}` | `200`, bijgewerkte gebruiker |
| `DELETE /users/{id}` | UUID in het pad | `200`, tekst `User deleted successfully` |
| `PUT /users/{id}/promote` | UUID in het pad | `200`, tekst `User promoted to admin successfully` |
| `PUT /users/{id}/demote` | UUID in het pad | `200`, tekst `User demoted successfully` |

Een gebruikerresponse bevat `id`, `email`, `firstName`, `lastName` en `roles`. Het gebruikersbeheer-endpoint voor aanmaken gebruikt `password`; dat wijkt af van het veld `passwordHash` in de huidige auth-endpoints.

### Test-endpoints

| Methode en endpoint | Toegang | Succesresponse |
| --- | --- | --- |
| `GET /api/test/all` | Publiek | `200`, tekst `Public Content.` |
| `GET /api/test/user` | Geblokkeerd door de huidige securityconfiguratie | De route bestaat, maar wordt door `anyRequest().denyAll()` geweigerd |

Deze testcontroller gebruikt zelf al `/api` als onderdeel van zijn backend-pad. Via de Vite-proxy is de publieke testroute daarom bereikbaar als `/api/api/test/all`.

### API-documentatie

Springdoc OpenAPI is als dependency aanwezig. De securityconfiguratie staat echter standaard alleen de hierboven expliciet genoemde routes toe en weigert overige requests. Swagger UI en `/v3/api-docs` zijn daarom mogelijk niet bereikbaar totdat die paden expliciet in de securityconfiguratie zijn toegestaan.

## Belangrijkste dependencies

### Frontend

De frontend-dependencies staan in `Frontend/package.json`:

- **Runtime:** `react`, `react-dom`, `react-router-dom`, `@tanstack/react-query`, `tailwindcss` en `@tailwindcss/vite`.
- **Ontwikkeling en build:** `vite`, `@vitejs/plugin-react`, `typescript`.
- **Linting:** `eslint`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` en de bijbehorende ESLint-configuraties.

Installeer de vastgelegde versies met `npm ci` vanuit de map `Frontend`.

### Backend

De backend-dependencies staan in `Backend/pom.xml` en worden grotendeels door Spring Boot beheerd:

- **Web en data:** Spring Boot Web MVC en Spring Data JPA.
- **Beveiliging:** Spring Boot Security en JJWT (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`).
- **Validatie:** Spring Boot Validation, Hibernate Validator en Jakarta Validation.
- **Database:** MySQL Connector/J en H2 (runtime).
- **API-documentatie:** Springdoc OpenAPI Web MVC UI.
- **Testen:** Spring Boot JPA- en Web MVC-testondersteuning, Spring Boot Testcontainers en Testcontainers voor JUnit Jupiter en MySQL.

Maven haalt de backend-dependencies op bij de eerste build of testuitvoering.

## Build, lint en tests

### Frontend

Voer deze opdrachten uit vanuit `Frontend`:

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` voert eerst de TypeScript-projectbuild uit en bouwt daarna de frontend met Vite. `npm run preview` serveert de gegenereerde build lokaal.

### Backend

Voer vanuit `Backend` uit:

```powershell
.\mvnw.cmd test
```

Op macOS of Linux:

```bash
./mvnw test
```

Testcontainers-tests kunnen een actieve Docker-installatie nodig hebben.

## Configuratie en veiligheid

- Pas database-instellingen aan in `Backend/src/main/resources/application.properties`.
- Gebruik unieke, sterke geheimen voor JWT in elke omgeving; deel of commit ze niet.
- De huidige JPA-instelling `ddl-auto=update` is bedoeld voor ontwikkeling. Gebruik voor productie een expliciete en gecontroleerde databaseschemamigratiestrategie.
- De backend is standaard geconfigureerd voor poort `8080`; de Vite-ontwikkelserver gebruikt een proxy naar die backend.

## Licentie

Er is momenteel geen licentie-informatie in deze repository opgenomen.


## Bronnen
-https://spring.io/projects/spring-boot
-https://react.dev/learn 
-https://developer.mozilla.org/fr/ 
-copilot (for debugging + react pages)
