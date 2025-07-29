# backend (NestJS Application)

本應用為 monorepo 中的後端服務，採用 [NestJS](https://nestjs.com/) 框架，並整合 [Prisma](https://www.prisma.io/) 作為 ORM，支援多個資料庫。此 README 主要說明 backend 專案的架構、開發流程與相關細節。

## 架構設計與微服務說明

本專案採用類微服務（microservice-like）架構，每個 module（如 `user.identity`、`user.wallet`）視為一個獨立服務，擁有自己的資料庫與資料存取層。各 module 目錄結構如下：

```
modules/{service}/
├── controllers/
│   ├── bo/   # Back Office API，路徑為 bo/{controller}/{action}
│   └── fe/   # Frontend API，路徑為 fe/{controller}/{action}
├── dtos/     # Data Transfer Objects，定義 controller 層 request/response 型別
│   ├── bo/   # Back Office API 專用 DTO
│   └── fe/   # Frontend API 專用 DTO
├── models/   # 服務/資料存取層用的物件型別（非 Prisma entity，常用於 service/repo 的參數或特殊回傳物件）
├── managers/ # 提供給其他 micro service 使用的 service
├── repos/    # 資料存取層（Repository）
└── services/ # 業務邏輯層（Service）
```

- **dtos/**：專門定義 API request/response 的型別，通常搭配 class-validator 做驗證，並用於 Swagger 文件產生。可依 bo/fe/external 分類。
  - 例如：`user.identity/dtos/bo/member.dto.ts`、`user.identity/dtos/fe/account.dto.ts`
- **models/**：定義 service/repo 層的參數物件、特殊回傳物件等 domain 型別，**不是 Prisma entity**，不直接對應資料表。常用於內部邏輯、聚合、複雜回傳結構等。
  - 例如：`user.identity/models/user.model.ts`
- **Prisma entity**：由 Prisma schema 產生，位於 `src/utils/prisma/generated/`，僅作為 ORM 資料表映射，不建議直接暴露於 API。

> 建議：controller 層僅用 DTO，service/repo 層用 model，ORM entity 僅於資料存取層使用，三者分工明確。

- 一般呼叫流程：controller → service → repo → db
- 若需跨 micro service 呼叫：controller → manager（其他 module）→ service → repo → db
  > 所有跨 module 的 manager 呼叫都應經過 service，不建議直接存取 repo，確保商業邏輯、驗證、權限等集中於 service 層，提升一致性與可維護性。
- manager 原則上應以協調、聚合為主，避免直接操作 repo，除非是單純查詢或聚合資料。
- 複雜邏輯、資料驗證、交易等應統一放在 service 層，確保一致性與可維護性。

每個 micro service 擁有獨立資料庫：
- `user.identity` → `user_identity_db`，Prisma 設定於 `prisma-user-identity-db`
- `user.wallet` → `user_wallet_db`，Prisma 設定於 `prisma-user-wallet-db`

## 目錄結構

```
apps/backend/
├── Dockerfile
├── package.json
├── src/
│   ├── main.ts
│   ├── app/
│   ├── modules/
│   │   ├── user.identity/
│   │   │   ├── controllers/
│   │   │   │   ├── bo/
│   │   │   │   └── fe/
│   │   │   ├── dtos/
│   │   │   │   ├── bo/
│   │   │   │   └── fe/
│   │   │   ├── models/
│   │   │   ├── managers/
│   │   │   ├── repos/
│   │   │   └── services/
│   │   └── user.wallet/
│   │       ├── controllers/
│   │       │   ├── bo/
│   │       │   └── fe/
│   │       ├── dtos/
│   │       │   ├── bo/
│   │       │   └── fe/
│   │       ├── models/
│   │       ├── managers/
│   │       ├── repos/
│   │       └── services/
│   ├── utils/
│   │   ├── authentication/  # 跨 API 驗證/授權相關（如 JwtAuthGuard, Public decorator, RequestMeta 等）
│   │   ├── crypto/          # 密碼雜湊、加解密等（如 bcryptjs 封裝）
│   │   ├── exception/       # 統一錯誤處理（如 PublicException, GlobalExceptionFilter, ErrorDto）
│   │   ├── prisma/
│   │   │   ├── generated/
│   │   │   ├── prisma-user-identity-db/
│   │   │   └── prisma-user-wallet-db/
│   │   └── ... # 其他 reusable custom packages (authorization, jwt, datetime, redis, etc)
│   └── ...
├── tests/
│   ├── modules/
│   │   ├── user.identity/
│   │   │   ├── controllers/
│   │   │   └── services/
│   │   └── user.wallet/
│   │       ├── managers/
│   │       └── services/
│   └── utils/
│       ├── authentication/
│       └── crypto/
└── ...
```

- `src/` 為主程式碼，`tests/` 為對應的單元測試，目錄層級與命名完全對應。
- 測試檔案命名建議與原始檔案一致，並以 `.spec.ts` 結尾。

## 主要技術
- **NestJS**：Node.js 伺服器端應用框架
- **Prisma**：ORM，支援多資料庫（user-identity, user-wallet）
- **ESLint**：程式碼檢查
- **Jest**：單元測試

## Prisma 操作
- 各資料庫有獨立 schema：
  - `src/utils/prisma/prisma-user-identity-db/schema.prisma`
  - `src/utils/prisma/prisma-user-wallet-db/schema.prisma`
- 產生 client：
  ```sh
  npx prisma generate --schema=src/utils/prisma/prisma-user-identity-db/schema.prisma
  npx prisma generate --schema=src/utils/prisma/prisma-user-wallet-db/schema.prisma
  ```
- 執行 migration：
  ```sh
  npx prisma migrate dev --schema=src/utils/prisma/prisma-user-identity-db/schema.prisma
  npx prisma migrate dev --schema=src/utils/prisma/prisma-user-wallet-db/schema.prisma
  ```

## 開發流程

### 啟動服務
```sh
npx nx serve backend
```

### 程式碼檢查
```sh
npx nx lint backend
```

### 執行測試
```sh
npx nx test backend
```

## API Exception Handling 說明

本專案 API 採用統一的錯誤處理與回應格式，重點如下：

- **全域 Exception Filter**：
  - 於 `src/utils/exception/global-exception.filter.ts` 實作，並在 `main.ts` 全域註冊。
  - 捕捉所有未處理例外，並統一回傳格式。
  - 支援自訂 PublicException、內建 HttpException 及未捕捉錯誤。

- **自訂 PublicException**：
  - 於 `src/utils/exception/public-exception.ts` 實作。
  - 用於回傳業務邏輯錯誤，攜帶 errorCode 與 message。
  - 範例：`throw new PublicException(PublicErrorCode.UsernameExist, '使用者已存在')`
  - PublicException 會回傳 HTTP 400（Bad Request）。

- **錯誤回應格式（ErrorDto）**：
  - 於 `src/utils/exception/error.dto.ts` 定義。
  - 統一回傳：
    ```json
    {
      "message": "錯誤訊息",
      "errorCode": "錯誤代碼（如有）"
    }
    ```
  - 不再於 body 內重複回傳 statusCode，僅於 HTTP header 傳遞。

- **API 文件與 Swagger**：
  - 所有 API 錯誤回應皆應標註 `@ApiResponse({ status: 400, type: ErrorDto })`（業務邏輯錯誤）及 `@ApiResponse({ status: 500, type: ErrorDto })`（伺服器內部錯誤）。
  - 方便前端自動產生型別與統一處理。

- **最佳實踐**：
  - 僅於 controller / manager / service / repo 層 throw PublicException，其他例外交由全域 Exception Filter 處理。
  - 一般未捕捉例外（如程式錯誤）會回傳 HTTP 500（Internal Server Error）。
  - 不直接暴露 Prisma/DB 例外，避免洩漏內部細節。
  - 可於 Exception Filter 擴充自動通知（如 Sentry、Slack）。

> 詳細實作請參考 `src/utils/exception/` 目錄下檔案與 main.ts 註冊方式。

## 共用 utils 說明

- **authentication/**：
  - 提供跨 API 的驗證與授權工具，如 JwtAuthGuard（JWT 驗證）、Public decorator（開放 API 標註）、RequestMeta（自訂 header 解析 tenantId 等）。
  - 建議所有需驗證/授權的 API 皆透過這些工具，並於 main.ts 全域註冊。

- **crypto/**：
  - 密碼雜湊、加解密等安全相關工具，預設封裝 bcryptjs，統一密碼處理方式。
  - 請勿於 service/controller 直接操作 bcryptjs，應統一呼叫 utils/crypto 內方法。

- **exception/**：
  - 統一錯誤處理與回應格式，包含 PublicException（業務錯誤）、GlobalExceptionFilter（全域例外攔截）、ErrorDto（錯誤回應格式）、PublicErrorCode（錯誤代碼列舉）等。
  - 詳細用法與規範請見本 README「API Exception Handling 說明」章節。

## 測試目錄結構與單元測試說明

### 測試目錄結構

本專案的單元測試（unit test）與整體目錄結構保持一致，方便對應原始碼與測試檔案：

```
apps/backend/src/modules/user.identity/           # 原始碼
apps/backend/tests/modules/user.identity/     # 對應的單元測試
apps/backend/src/modules/user.wallet/            # 原始碼
apps/backend/tests/modules/user.wallet/       # 對應的單元測試
apps/backend/src/utils/                          # 共用工具原始碼
apps/backend/tests/utils/                    # 共用工具測試
```

- 測試檔案命名建議與原始檔案一致，並以 `.spec.ts` 結尾。
- 測試目錄與原始碼目錄層級、命名完全對應，方便查找與維護。

### 單元測試（Unit Test）

- 單元測試主要覆蓋 service、controller、utils 等邏輯單元。
- 測試框架採用 [Jest](https://jestjs.io/)。
- 建議每個 service/controller 都有對應的 `.spec.ts` 測試檔，涵蓋正常流程與錯誤情境。
- 測試時可使用 mock 物件（如 jest.fn()）隔離依賴，聚焦單元本身邏輯。
- 建議覆蓋：
  - 正常流程（成功回傳）
  - 參數錯誤、權限錯誤、找不到資料等異常情境
  - 依賴服務失敗時的處理

#### Coverage（覆蓋率）

- 可用 `nx test backend --coverage` 產生覆蓋率報告，報告路徑：`apps/backend/coverage/index.html`
- 建議定期檢查覆蓋率，確保關鍵邏輯皆有測試。

#### 範例

- `apps/backend/tests/modules/user.identity/services/account.service.spec.ts`：測試帳號服務的登入、註冊、錯誤處理等。
- `apps/backend/tests/modules/user.identity/controllers/fe/account.controller.spec.ts`：測試前台帳號 API 的回應、錯誤處理。

---

如需撰寫新測試，請依照上述目錄結構與命名規範放置，並參考現有測試檔案撰寫。

## 其他
- 請參考各模組、service、controller 內註解以獲得更多細節。
- 若有新增資料庫，請於 `src/utils/prisma/` 下建立對應 schema 與 service。
- 若有新增 micro service，請於 `modules/` 下建立對應目錄，並於 `utils/` 擴充 reusable package。
