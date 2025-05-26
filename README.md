# Loyall Treasures

## Opis projektu

Loyall Treasures to aplikacja internetowa zaprojektowana jako platforma do odkrywania, zarządzania i wykorzystywania zniżek oraz ofert promocyjnych. Użytkownicy mogą rejestrować się, logować, przeglądać dostępne zniżki, oznaczać je jako ulubione oraz realizować je w określonych lokalizacjach. Aplikacja oferuje również panel administracyjny, który pozwala na zarządzanie użytkownikami, zniżkami, kategoriami zniżek oraz lokalizacjami. System powiadomień, wykorzystujący RabbitMQ, informuje użytkowników np. o pomyślnej rejestracji.

Główne funkcjonalności:

- Rejestracja i logowanie użytkowników.
- Przeglądanie i filtrowanie zniżek.
- Dodawanie zniżek do ulubionych.
- Realizacja zniżek.
- Panel administracyjny do zarządzania treścią i użytkownikami.
- System oceniania zniżek.
- Asynchroniczne powiadomienia (np. po rejestracji użytkownika).

## Schemat Architektury

Aplikacja Loyall Treasures zbudowana jest w architekturze klient-serwer z dodatkowym komponentem workera do obsługi powiadomień.

```
+-----------------+      +----------------------+      +-------------------------+
|  Użytkownik     |----->|  Frontend (Next.js)  |<---->|  Backend API (Node.js)  |
|  (Przeglądarka) |      +----------------------+      +-------------------------+
+-----------------+                                              |
                                                                 | (HTTP/REST, JWT)
                                                                 v
                                                      +---------------------+
                                                      | Baza Danych (PostgreSQL)|
                                                      +---------------------+
                                                                 ^
                                                                 | (Knex.js/Objection.js)
                                                                 |
+-------------------------+      +-------------------------+      +-------------------------+
| Serwer Powiadomień      |<-----|  RabbitMQ               |<-----| Usługi Backendu         |
| (Notification Worker)   |      |  (Kolejka komunikatów)  |      | (np. UserService)       |
+-------------------------+      +-------------------------+      +-------------------------+
        (amqplib)                         (amqplib)                        |
                                                                 | (Swagger)
                                                                 v
                                                      +---------------------+
                                                      | Dokumentacja API    |
                                                      | (Swagger UI)        |
                                                      +---------------------+
```

**Opis diagramu:**

1.  **Użytkownik (Przeglądarka):** Interfejs użytkownika, z którym użytkownik wchodzi w interakcję.
2.  **Frontend (Next.js):** Aplikacja kliencka zbudowana przy użyciu Next.js (framework React), odpowiedzialna za renderowanie interfejsu i komunikację z backendem.
3.  **Backend API (Node.js/Express.js):** Serwerowa część aplikacji obsługująca logikę biznesową, zarządzanie danymi i udostępniająca REST API dla frontendu.
    - Uwierzytelnianie odbywa się za pomocą tokenów JWT.
    - Swagger UI jest dostępne do przeglądania dokumentacji API.
4.  **Baza Danych (PostgreSQL):** Relacyjna baza danych używana do przechowywania danych aplikacji (użytkownicy, zniżki, kategorie, etc.).
    - Interakcja z bazą danych odbywa się poprzez ORM Objection.js i query builder Knex.js.
5.  **RabbitMQ:** Broker wiadomości używany do obsługi asynchronicznych zadań, takich jak wysyłanie powiadomień email po rejestracji użytkownika.
6.  **Serwer Powiadomień (Notification Worker):** Oddzielny proces Node.js, który konsumuje wiadomości z RabbitMQ i wykonuje odpowiednie akcje (np. symuluje wysyłkę email).

## Instrukcje Uruchomienia

### Wymagania wstępne

- Node.js (zalecana wersja LTS)
- npm lub pnpm (projekt używa pnpm, zgodnie z `package.json`)
- PostgreSQL
- RabbitMQ

### Backend

1.  **Sklonuj repozytorium:**
    ```bash
    git clone
    cd Loyall-Treasures/backend
    ```
2.  **Zainstaluj zależności:**
    ```bash
    pnpm install
    ```
3.  **Skonfiguruj zmienne środowiskowe:**
    Skopiuj plik `.env.example` do `.env` i uzupełnij odpowiednie wartości:
    - `PORT` (np. 8080)
    - `NODE_ENV` (np. `development`)
    - `JWT_SECRET` (losowy, bezpieczny ciąg znaków)
    - `RABBITMQ_URL` (np. `amqp://localhost`)
    - Zmienne konfiguracyjne dla bazy danych PostgreSQL (host, port, użytkownik, hasło, nazwa bazy danych) używane w `knexfile.js`.
4.  **Uruchom migracje bazy danych:**

    ```bash
    pnpm run migrate
    # lub
    # npx knex migrate:latest
    ```

5.  **Wypełnij bazę danych danymi początkowymi (opcjonalnie, dla dewelopmentu):**

    ```bash
    pnpm run seed
    # lub
    # npx knex seed:run
    ```

6.  **Uruchom serwer backendu:**

    ```bash
    pnpm start
    # lub
    # node server.js
    ```

    Serwer powinien być dostępny pod adresem `http://localhost:PORT` (gdzie `PORT` to wartość z pliku `.env`).

7.  **Uruchom worker powiadomień (w osobnym terminalu):**
    ```bash
    node workers/notificationWorker.js
    ```

### Frontend

1.  **Przejdź do katalogu frontendu:**
    ```bash
    cd ../frontend
    ```
2.  **Zainstaluj zależności:**
    ```bash
    pnpm install
    ```
3.  **Skonfiguruj zmienne środowiskowe (jeśli są wymagane):**
    Utwórz plik `.env.local` i dodaj ewentualne zmienne, np.:
    - `NEXT_PUBLIC_API_URL=http://localhost:8080/api` (lub inny port backendu, jeśli został zmieniony)
4.  **Uruchom serwer deweloperski frontendu:**

    ```bash
    pnpm dev
    ```

    Aplikacja frontendowa powinna być dostępna pod adresem `http://localhost:3000`.

## Użyte Technologie

### Backend

- **Node.js:** Środowisko uruchomieniowe JavaScript po stronie serwera.
  - _Uzasadnienie:_ Popularność, duża społeczność, wydajność dla aplikacji I/O-bound, możliwość używania JavaScript na frontendzie i backendzie.
- **Express.js:** Minimalistyczny framework webowy dla Node.js.
  - _Uzasadnienie:_ Elastyczność, prostota, szybkość tworzenia API REST.
- **Knex.js:** Query builder SQL dla JavaScript.
  - _Uzasadnienie:_ Ułatwia interakcję z różnymi bazami danych SQL (PostgreSQL, SQLite), zarządzanie migracjami i seedami, zapewnia bezpieczeństwo przed SQL injection.
- **Objection.js:** ORM (Object-Relational Mapper) dla Node.js.
  - _Uzasadnienie:_ Umożliwia pracę z bazą danych w sposób obiektowy, definiowanie modeli i relacji, co upraszcza logikę biznesową. Bazuje na Knex.js.
- **PostgreSQL:** Zaawansowany, obiektowo-relacyjny system baz danych.
  - _Uzasadnienie:_ Niezawodność, skalowalność, bogaty zestaw funkcji, wsparcie dla transakcji i złożonych zapytań.
- **SQLite3:** Lekka, plikowa baza danych SQL (dla testów).
  - _Uzasadnienie:_ Łatwość konfiguracji i użycia w środowiskach testowych, nie wymaga oddzielnego serwera.
- **JSON Web Tokens (JWT):** Standard otwarty (RFC 7519) do tworzenia tokenów dostępu.
  - _Uzasadnienie:_ Umożliwia bezpieczną i bezstanową autoryzację API.
- **Passport.js (z `passport-jwt`):** Middleware do autentykacji dla Node.js.
  - _Uzasadnienie:_ Modułowość i elastyczność w implementacji różnych strategii uwierzytelniania, w tym JWT.
- **bcrypt:** Biblioteka do hashowania haseł.
  - _Uzasadnienie:_ Standard branżowy do bezpiecznego przechowywania haseł użytkowników.
- **Swagger (`swagger-jsdoc`, `swagger-ui-express`):** Narzędzia do dokumentacji API.
  - _Uzasadnienie:_ Ułatwia generowanie interaktywnej dokumentacji API na podstawie komentarzy w kodzie, co jest pomocne dla deweloperów frontendu i backendu.
- **RabbitMQ (`amqplib`):** Broker wiadomości.
  - _Uzasadnienie:_ Umożliwia asynchroniczną komunikację między serwisami, zwiększając skalowalność i odporność systemu (np. do wysyłki powiadomień).
- **dotenv:** Moduł do ładowania zmiennych środowiskowych z pliku `.env`.
  - _Uzasadnienie:_ Utrzymuje konfigurację aplikacji oddzieloną od kodu źródłowego.
- **CORS (`cors`):** Middleware do obsługi Cross-Origin Resource Sharing.
  - _Uzasadnienie:_ Niezbędny do komunikacji między frontendem a backendem działającymi na różnych portach/domenach.
- **Jest & Supertest:** Framework do testowania i biblioteka do asercji HTTP.
  - _Uzasadnienie:_ Popularne i wszechstronne narzędzia do pisania testów jednostkowych i integracyjnych dla backendu.

### Frontend

- **Next.js:** Framework Reactowy.
  - _Uzasadnienie:_ Zapewnia renderowanie po stronie serwera (SSR), generowanie stron statycznych (SSG), routing oparty na systemie plików i optymalizację, co przekłada się na lepszą wydajność i SEO.
- **React:** Biblioteka JavaScript do budowy interfejsów użytkownika.
  - _Uzasadnienie:_ Komponentowa architektura ułatwia tworzenie reużywalnych i zarządzalnych elementów UI.
- **TypeScript:** Nadzbiór JavaScript dodający statyczne typowanie.
  - _Uzasadnienie:_ Poprawia jakość kodu, wykrywa błędy na wczesnym etapie i ułatwia pracę w zespole.
- **Tailwind CSS:** Framework CSS typu utility-first.
  - _Uzasadnienie:_ Umożliwia szybkie prototypowanie i budowanie niestandardowych interfejsów bez pisania dużej ilości własnego CSS.
- **React Icons:** Biblioteka ikon dla React.
  - _Uzasadnienie:_ Łatwy dostęp do popularnych zestawów ikon, co wzbogaca interfejs użytkownika.
- **Next/font:** Optymalizacja fontów w Next.js.
  - _Uzasadnienie:_ Automatyczna optymalizacja ładowania fontów (Google Fonts lub lokalnych) dla lepszej wydajności.
- **ESLint:** Narzędzie do lintowania kodu JavaScript/TypeScript.
  - _Uzasadnienie:_ Pomaga utrzymać spójność kodu i unikać potencjalnych błędów.
- **AuthContext (React Context API):** Zarządzanie stanem uwierzytelnienia.
  - _Uzasadnienie:_ Prosty sposób na współdzielenie danych (np. informacji o zalogowanym użytkowniku) między komponentami bez konieczności "prop drilling".
