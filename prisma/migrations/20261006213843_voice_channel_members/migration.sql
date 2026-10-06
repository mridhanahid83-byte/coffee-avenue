-- AlterTable
ALTER TABLE "voice_channels" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "voice_channel_members" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "voice_channel_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voice_channel_members_channelId_employeeId_key" ON "voice_channel_members"("channelId", "employeeId");

-- AddForeignKey
ALTER TABLE "voice_channel_members" ADD CONSTRAINT "voice_channel_members_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "voice_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_channel_members" ADD CONSTRAINT "voice_channel_members_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
