CREATE TABLE "Event" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "username" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserEvent" (
  "username" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,

  CONSTRAINT "UserEvent_pkey" PRIMARY KEY ("username","eventId")
);

ALTER TABLE "Egg" ADD COLUMN "eventId" TEXT;

ALTER TABLE "Event" ADD CONSTRAINT "Event_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Egg" ADD CONSTRAINT "Egg_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
