-- CreateEnum
CREATE TYPE "CONSENT_TYPES" AS ENUM ('EMAIL_NOTIFICATIONS', 'SMS_NOTIFICATIONS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserConsents" (
    "userId" TEXT NOT NULL,
    "consent" "CONSENT_TYPES" NOT NULL,

    CONSTRAINT "UserConsents_pkey" PRIMARY KEY ("userId","consent")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserConsents" ADD CONSTRAINT "UserConsents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
