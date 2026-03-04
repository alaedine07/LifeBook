-- CreateTable
CREATE TABLE "MoodComment" (
    "id" SERIAL NOT NULL,
    "moodId" INTEGER NOT NULL,
    "therapistId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MoodComment" ADD CONSTRAINT "MoodComment_moodId_fkey" FOREIGN KEY ("moodId") REFERENCES "Mood"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodComment" ADD CONSTRAINT "MoodComment_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
