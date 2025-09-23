-- CreateTable
CREATE TABLE "GroceryItemStatusHistory" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "groceryItemId" UUID NOT NULL,
    "oldStatus" "GroceryItemStatus",
    "newStatus" "GroceryItemStatus" NOT NULL,
    "changedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroceryItemStatusHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroceryItemStatusHistory" ADD CONSTRAINT "GroceryItemStatusHistory_groceryItemId_fkey" FOREIGN KEY ("groceryItemId") REFERENCES "GroceryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE; 