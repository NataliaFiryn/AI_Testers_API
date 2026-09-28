# AI Testers API

Podstawowy projekt testów API: Playwright, TypeScript, ESLint, Prettier i Husky.

## Uruchomienie

Wymagania: Node.js 22.17+ i npm oraz Git do obsługi hooków.

```sh
npm ci
```

Skopiuj `.env.example` do `.env` (PowerShell: `Copy-Item .env.example .env`).
W przygotowanym lokalnie projekcie `.env` już istnieje.

```sh
npm test
```

Domyślny `BASE_URL=http://127.0.0.1:3100` uruchamia automatycznie lokalny serwer
demonstracyjny. Playwright kończy go po testach. Port 3100 musi być wolny.
Test sprawdza odpowiedź `GET /health`: kod 200, JSON i `{ "status": "ok" }`.
Testy API nie wymagają instalowania przeglądarek.

Jeżeli PowerShell blokuje `npm.ps1`, używaj `npm.cmd` i `npx.cmd`.

## Konfiguracja środowiska

`.env` jest ignorowany przez Git. `.env.example` zawiera wyłącznie przykładowe wartości.
Zmienna `BASE_URL` jest wymagana i musi być adresem HTTP lub HTTPS.
Zmienne przekazane przez środowisko, np. CI, mają pierwszeństwo przed `.env`.

Po ustawieniu innego `BASE_URL` lokalny serwer nie jest uruchamiany.
Dostosuj wtedy klienta i test do kontraktu docelowego API.
Nie zapisuj sekretów w repozytorium; raporty i ślady mogą zawierać dane żądań.

## Struktura

- `tests/api/` — scenariusze i asercje.
- `tests/fixtures/` — współdzielone fixture; klienci korzystają z kontekstu request danego testu.
- `tests/support/` — lokalny serwer demonstracyjny.
- `src/clients/` — klienci endpointów API.
- `src/config/` — odczyt i walidacja konfiguracji.
- `playwright.config.ts` — konfiguracja uruchamiania i raportowania.

## Komendy

| Komenda                | Działanie                         |
| ---------------------- | --------------------------------- |
| `npm test`             | Uruchomienie testów API           |
| `npm run test:debug`   | Uruchomienie w trybie debugowania |
| `npm run test:report`  | Otwarcie raportu HTML             |
| `npm run lint`         | Kontrola ESLint                   |
| `npm run lint:fix`     | Automatyczne poprawki ESLint      |
| `npm run format`       | Formatowanie plików               |
| `npm run format:check` | Kontrola formatowania             |
| `npm run typecheck`    | Kontrola typów TypeScript         |

Playwright uruchamia TypeScript bez sprawdzania typów, dlatego `typecheck` jest osobnym krokiem.
Raport HTML trafia do `playwright-report/`, a artefakty błędów do `test-results/`.
W CI włączone są dwie ponowne próby, jeden worker i zakaz `test.only`.

## Hooki Git

`npm ci` uruchamia `prepare`, który konfiguruje Husky.
Hook `pre-commit` uruchamia lint-staged: ESLint i Prettier na plikach kodu
przygotowanych do commita oraz Prettier na dokumentacji i plikach konfiguracyjnych.
Pełne testy i kontrolę typów uruchamiaj osobno przed wysłaniem zmian.
W CI bez hooków ustaw zmienną środowiskową `HUSKY=0` przed instalacją.
