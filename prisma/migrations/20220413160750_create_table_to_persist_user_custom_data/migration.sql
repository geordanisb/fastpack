-- CreateTable
CREATE TABLE "UserCustomDate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "identifier" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCustomDate_identifier_key" ON "UserCustomDate"("identifier");
