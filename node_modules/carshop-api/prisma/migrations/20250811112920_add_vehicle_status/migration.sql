-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('ACTIVE', 'IN_SERVICE', 'INACTIVE');

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "status" "VehicleStatus" NOT NULL DEFAULT 'ACTIVE';
