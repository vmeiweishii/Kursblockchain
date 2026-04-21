# RefurbChain — прототип блокчейн-паспорта б/у электроники

## Что внутри
- `contracts/` — Solidity смарт-контракт реестра.
- `scripts/deploy.js` — деплой и экспорт ABI/адреса.
- `test/` — тесты Hardhat.
- `backend/` — Express API.
- `frontend/` — React/Vite UI.
- `docs/architecture.md` — архитектурное описание.

## Требования
- Node.js 20+
- npm 10+

## Установка
```bash
cd ~/Kursblockchain
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

Опционально:
```bash
cp .env.example .env
```

## Запуск
### Вариант 1 — одной командой
```bash
cd ~/Kursblockchain
npm run start:all
```

Это поднимет:
- локальный Hardhat node (`8545`);
- деплой контракта и экспорт `contract-config.json`;
- backend (`3001`);
- frontend (`5173`).

Остановить всё:
```bash
npm run stop:all
```

### Вариант 2 — по шагам (если нужна диагностика)
Открой 4 терминала.

### Терминал 1 — локальный блокчейн
```bash
cd ~/Kursblockchain
npx hardhat node
```

### Терминал 2 — деплой контракта
```bash
cd ~/Kursblockchain
npm run deploy:local
```

После этого появятся:
- `backend/contract-config.json`
- `frontend/src/contract-config.json`

### Терминал 3 — backend
```bash
cd ~/Kursblockchain/backend
npm run dev
```
Backend будет на `http://localhost:3001`.

### Терминал 4 — frontend
```bash
cd ~/Kursblockchain/frontend
npm run dev
```
Frontend обычно будет на `http://localhost:5173`.

## Как проверить
1. Открой главную страницу frontend.
2. Нажми `Создать паспорт` с демо-данными.
3. Увидишь `reportId`, `deviceHash`, `reportHash`, tx hash и QR.
4. Открой страницу проверки по ссылке или QR.
5. Убедись, что видны статус, диагностика и хэш отчёта.

## Запуск тестов
```bash
cd ~/Kursblockchain
npx hardhat test
```

## Healthcheck
После старта можно проверить сервисы:
```bash
cd ~/Kursblockchain
npm run healthcheck
```
