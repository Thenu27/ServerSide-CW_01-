-- CreateTable
CREATE TABLE "FeaturedAlumnus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeaturedAlumnus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedAlumnus_month_year_key" ON "FeaturedAlumnus"("month", "year");

-- AddForeignKey
ALTER TABLE "FeaturedAlumnus" ADD CONSTRAINT "FeaturedAlumnus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
