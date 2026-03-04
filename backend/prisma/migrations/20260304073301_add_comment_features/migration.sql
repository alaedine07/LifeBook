-- Add therapist relation to ReflectionComment if the foreign key doesn't exist
DO $$
BEGIN
  BEGIN
    ALTER TABLE "ReflectionComment" ADD CONSTRAINT "ReflectionComment_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    -- Constraint already exists, do nothing
    NULL;
  END;
END $$;

-- CreateTable MoodComment
CREATE TABLE IF NOT EXISTS "MoodComment" (
    "id" SERIAL NOT NULL,
    "moodId" INTEGER NOT NULL,
    "therapistId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey to MoodComment if table was just created
DO $$
BEGIN
  BEGIN
    ALTER TABLE "MoodComment" ADD CONSTRAINT "MoodComment_moodId_fkey" FOREIGN KEY ("moodId") REFERENCES "Mood"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER TABLE "MoodComment" ADD CONSTRAINT "MoodComment_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;
