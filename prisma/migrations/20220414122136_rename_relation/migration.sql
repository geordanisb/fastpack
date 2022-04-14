/*
  Warnings:

  - You are about to drop the `UserCustomDate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserCustomDate";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserCustomData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "identifier" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCustomData_identifier_key" ON "UserCustomData"("identifier");
