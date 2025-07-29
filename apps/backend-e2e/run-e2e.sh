#!/bin/zsh

# 1. Build backend
# npx nx run backend:build

# 2. 啟動 backend (e2e) server，背景執行
# DOTENV_CONFIG_PATH=apps/backend/.env.e2e npx nx serve backend &
# DOTENV_CONFIG_PATH=apps/backend/.env.e2e npx ts-node apps/backend/src/main.ts &
# DOTENV_CONFIG_PATH=apps/backend/.env.e2e npx ts-node --inspect apps/backend/src/main.ts &
DOTENV_CONFIG_PATH=apps/backend/.env.e2e node --inspect -r ts-node/register apps/backend/src/main.ts &
# DOTENV_CONFIG_PATH=apps/backend/.env.e2e npx ts-node-dev apps/backend/src/main.ts &
# DOTENV_CONFIG_PATH=apps/backend/.env.e2e node apps/backend/src/main.js &
SERVER_PID=$!

# 3. 等待 server port 開啟（假設 3001）
echo "Waiting for backend server to be ready..."
until nc -z localhost 3001; do sleep 1; done

# 4. 執行 e2e 測試
npx nx e2e backend-e2e
E2E_RESULT=$?

# 5. 關閉 backend server
kill $SERVER_PID

exit $E2E_RESULT
