# backend-e2e

這是 `apps/backend` (NestJS) 專案的 E2E (End-to-End) 測試專案，採用 Jest + axios 進行 API 端對端測試。

## 目錄結構

```
apps/backend-e2e/
├── src/
│   └── backend/
│       ├── backend.spec.ts
│       └── modules
│           └── {modules}/
│               └── {area}/
│                   └── {controller}.e2e-spec.ts
│       └── ...
│   └── support/
│       ├── global-setup.ts
│       ├── global-teardown.ts
│       └── test-setup.ts
├── jest.config.ts
├── package.json
└── tsconfig.json
```

- `{modules}`：對應 backend 各個 module（如 user.identity, user.wallet 等）
- `{area}`：API 分區，fe (frontend)、bo (backoffice)
- `{controller}`：對應 controller 名稱
- 每個 controller 的 e2e 測試建議獨立一檔，命名為 `{controller}.e2e-spec.ts`

## 如何執行 E2E 測試

1. 確保 backend 服務已啟動（預設 http://localhost:3000）
2. 執行 e2e 測試：

```sh
npx nx e2e backend-e2e
```

或直接用 pnpm：

```sh
pnpm nx e2e backend-e2e
```

## 撰寫新測試

- 測試檔案請依照 `src/backend/modules/{modules}/{area}/{controller}.e2e-spec.ts` 結構放置。
- 建議每個主要 controller 各自建立 e2e 測試檔，命名以 `.e2e-spec.ts` 結尾。
- 可直接使用 axios 發送 HTTP 請求，驗證 API 行為。
- 如有 JWT 驗證，請於測試前先取得 token 並帶入 headers。
- 建議涵蓋：
  - 正常流程（成功回傳）
  - 錯誤情境（參數錯誤、權限錯誤等）
  - 權限驗證（如需登入、token 驗證）

## 範例

- `src/backend/modules/backend.spec.ts`：API 健康檢查（GET /api）
- `src/backend/modules/user.identity/fe/account.e2e-spec.ts`：user.identity module 前台帳號 API 的 e2e 測試

## 其他

- 可於 `support/` 目錄撰寫全域 setup/teardown。
- 詳細請參考現有測試檔案範例。
