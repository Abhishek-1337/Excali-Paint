-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "revokedAt" TIMESTAMP(3),
ALTER COLUMN "revoked" DROP NOT NULL;
