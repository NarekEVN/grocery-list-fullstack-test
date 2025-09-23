/*
  Warnings:

  - Added the required column `userId` to the `GroceryItem` table without a default value. This is not possible if the table is not empty.

*/

ALTER TABLE "GroceryItem" ADD COLUMN "userId" UUID;

UPDATE "GroceryItem" 
SET "userId" = (
  SELECT "id" FROM "User" WHERE "email" = 'testuser@example.com' LIMIT 1
)
WHERE "userId" IS NULL;

ALTER TABLE "GroceryItem" ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "GroceryItem" ADD CONSTRAINT "GroceryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
