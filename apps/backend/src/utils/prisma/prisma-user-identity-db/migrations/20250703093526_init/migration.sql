-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('MEMBER', 'BO_ADMIN', 'BO_AGENT', 'CRM_ADMIN', 'BO_SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "UserDevice" AS ENUM ('UNKNOWN', 'WINDOWS', 'MAC', 'LINUX', 'CHROME_OS', 'IOS_H5', 'IOS_APP', 'ANDROID_H5', 'ANDROID_APP');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "created_by" UUID,
    "updated_on" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "updated_by" UUID,
    "tenant_id" UUID NOT NULL,
    "type" "UserType" NOT NULL,
    "status" "UserStatus" NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "phone_prefix" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "agent_id" UUID,
    "src_from" TEXT,
    "ip_from" TEXT,
    "device_src" "UserDevice" NOT NULL,
    "real_name" TEXT,
    "nickname" TEXT,
    "dob" DATE,
    "is_personal_info_completed" BOOLEAN,
    "latest_login_on" TIMESTAMPTZ(6),
    "latest_login_ip" TEXT,
    "is_valid" BOOLEAN,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player" (
    "id" BIGSERIAL NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_credential" (
    "user_id" UUID NOT NULL,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "created_by" UUID,
    "updated_on" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "updated_by" UUID,
    "password_hash" TEXT NOT NULL,
    "withdrawal_password_hash" TEXT,
    "access_failed_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_credential_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "idx_tenant_type_created_on" ON "user"("tenant_id", "type", "created_on");

-- CreateIndex
CREATE UNIQUE INDEX "player_user_id_key" ON "player"("user_id");

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
