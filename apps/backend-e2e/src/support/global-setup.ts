// import { waitForPortOpen } from '@nx/node/utils';

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

module.exports = async function() {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  // const host = process.env.HOST ?? 'localhost';
  // const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  // await waitForPortOpen(port, { host });

  // Prisma migrate reset for all DB schemas
  const { execSync } = require('child_process');
  await execSync('npx prisma migrate reset --force --skip-seed --schema=apps/backend/src/utils/prisma/prisma-user-identity-db/schema.prisma', { stdio: 'inherit' });
  // await execSync('npx prisma migrate reset --force --schema=apps/backend/src/utils/prisma/prisma-user-identity-db/schema.prisma', { stdio: 'inherit' });
  await execSync('npx prisma migrate reset --force --skip-seed --schema=apps/backend/src/utils/prisma/prisma-user-wallet-db/schema.prisma', { stdio: 'inherit' });

  await execSync('npx nx run backend:prisma-seed', { stdio: 'inherit' });

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};

