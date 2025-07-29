-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'THB', 'JPY', 'BDT', 'CNY', 'VND', 'PHP', 'KRW', 'TWD', 'HKD', 'IDR', 'INR', 'MMK', 'BTC', 'BTC_BTC', 'ETH', 'ETH_ERC20', 'USDT', 'USDT_ERC20', 'USDT_TRC20');

-- CreateTable
CREATE TABLE "wallet" (
    "id" TEXT NOT NULL,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "created_by" UUID,
    "updated_on" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "updated_by" UUID,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "currency" "Currency" NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "bonus" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "overflow_debit" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);
