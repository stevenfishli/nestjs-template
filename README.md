> **Note:**  
> This repository is a minimal template and does not include detailed explanations.  
> A separate repository will provide step-by-step guides and in-depth explanations of the technologies used here.  
> **Most documentation and future guides will be provided primarily in English.**

# NestJS template

本專案為一個基於 [Nx](https://nx.dev/) 的 monorepo，主要用於管理多個應用程式（applications）與共用函式庫（libraries）。目前包含一個 NestJS 應用（`apps/backend`）。

## 使用前準備

請先將專案根目錄及各應用目錄下的 `.env.sample` 複製為 `.env`，並依實際需求調整環境變數內容。

## 專案結構

```
pace-monorepo/
├── apps/                # 各個應用程式
│   ├── backend/         # NestJS 後端應用
│   └── ...              # 其他應用（未來可擴充）
├── libs/                # 共用函式庫（如有）
├── package.json         # Monorepo 主要 package.json
├── nx.json              # Nx 設定
├── tsconfig.base.json   # TypeScript 共用設定
├── README.md            # 專案說明文件（本檔）
└── ...
```

## 技術棧
- **Nx**：Monorepo 管理工具
- **NestJS**：後端應用框架（於 `apps/backend`）
- **Prisma**：ORM，管理多個資料庫
- **ESLint**：程式碼靜態檢查
- **Jest**：單元測試

## 各應用程式說明
- `apps/backend/`：NestJS 應用，詳細說明請見 [`apps/backend/README.md`](./apps/backend/README.md)
- 其他應用可依需求新增於 `apps/` 目錄下

## 套件管理工具

本專案採用 [pnpm](https://pnpm.io/) 作為套件管理工具，建議全域安裝 pnpm 並以 pnpm 取代 npm 進行依賴安裝與指令執行。

### 安裝 pnpm（如尚未安裝）
```sh
npm install -g pnpm
```

### 安裝依賴
> 為確保團隊 pnpm 版本一致，建議使用下列指令安裝依賴：
```sh
npx pnpm@9 install
```
（如需指定其他版本，請將 9 替換為專案推薦版本）

> package.json 也建議加上 engines 欄位：
```json
"engines": {
  "pnpm": ">=9.0.0 <10"
}
```

### 常用 pnpm 指令
- 安裝新套件（至 monorepo root）：
  ```sh
  pnpm add -w <package>
  ```
- 安裝新套件到指定 workspace（如 backend）：
  ```sh
  pnpm add <package> -F backend
  ```
- 安裝為 devDependencies（全域）：
  ```sh
  pnpm add -Dw <package>
  ```
- 安裝為 devDependencies（指定 workspace）：
  ```sh
  pnpm add -D <package> -F backend
  ```
- 移除套件：
  ```sh
  pnpm remove <package>
  ```
- 執行 Nx 任務（與 npm 用法相同）：
  ```sh
  pnpm nx <command>
  # 例如 pnpm nx serve backend
  ```

## 開發流程

### 查看可用 Nx 任務
```sh
npx nx show project <project-name>
```

### 啟動後端（以 backend 為例）
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

## 其他資源
- [Nx 官方文件](https://nx.dev/)
- [NestJS 官方文件](https://docs.nestjs.com/)
- [Prisma 官方文件](https://www.prisma.io/docs/)

---

如需各應用詳細說明，請參考對應目錄下的 `README.md`。
