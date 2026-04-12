-- CreateTable
CREATE TABLE "Degree" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "degreeName" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Degree_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Degree_profileId_idx" ON "Degree"("profileId");

-- AddForeignKey
ALTER TABLE "Degree" ADD CONSTRAINT "Degree_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
