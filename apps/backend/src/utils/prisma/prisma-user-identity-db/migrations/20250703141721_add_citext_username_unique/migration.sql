/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id,username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "created_on" SET DEFAULT now(),
ALTER COLUMN "updated_on" SET DEFAULT now(),
ALTER COLUMN "username" SET DATA TYPE CITEXT;

-- AlterTable
ALTER TABLE "user_credential" ALTER COLUMN "created_on" SET DEFAULT now(),
ALTER COLUMN "updated_on" SET DEFAULT now();

-- CreateIndex
CREATE UNIQUE INDEX "user_tenant_id_username_key" ON "user"("tenant_id", "username");
