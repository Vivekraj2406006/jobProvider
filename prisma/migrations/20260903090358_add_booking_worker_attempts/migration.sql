-- CreateEnum
CREATE TYPE "BookingAttemptStatus" AS ENUM ('OFFERED', 'ACCEPTED', 'REJECTED', 'ASSIGNED');

-- CreateTable
CREATE TABLE "BookingWorkerAttempt" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "status" "BookingAttemptStatus" NOT NULL DEFAULT 'OFFERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingWorkerAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingWorkerAttempt_bookingId_idx" ON "BookingWorkerAttempt"("bookingId");

-- CreateIndex
CREATE INDEX "BookingWorkerAttempt_workerId_idx" ON "BookingWorkerAttempt"("workerId");

-- CreateIndex
CREATE INDEX "BookingWorkerAttempt_bookingId_status_idx" ON "BookingWorkerAttempt"("bookingId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BookingWorkerAttempt_bookingId_workerId_key" ON "BookingWorkerAttempt"("bookingId", "workerId");

-- AddForeignKey
ALTER TABLE "BookingWorkerAttempt" ADD CONSTRAINT "BookingWorkerAttempt_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingWorkerAttempt" ADD CONSTRAINT "BookingWorkerAttempt_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
