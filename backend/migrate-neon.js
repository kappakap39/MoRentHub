const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('🔄 Creating database tables on Neon PostgreSQL...');

  await sql`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" SERIAL PRIMARY KEY,
      "username" VARCHAR(255) UNIQUE NOT NULL,
      "password" VARCHAR(255) NOT NULL,
      "name" VARCHAR(255) DEFAULT 'Admin',
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "Listing" (
      "id" SERIAL PRIMARY KEY,
      "category" VARCHAR(50) NOT NULL,
      "title" VARCHAR(255) NOT NULL,
      "description" TEXT NOT NULL,
      "price" DOUBLE PRECISION NOT NULL,
      "priceUnit" VARCHAR(50) NOT NULL DEFAULT 'month',
      "status" VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
      "rentalStartDate" TIMESTAMP,
      "rentalEndDate" TIMESTAMP,
      "locationName" VARCHAR(255) NOT NULL,
      "address" TEXT,
      "latitude" DOUBLE PRECISION NOT NULL DEFAULT 13.7563,
      "longitude" DOUBLE PRECISION NOT NULL DEFAULT 100.5018,
      "contactName" VARCHAR(255) NOT NULL DEFAULT 'Admin Rental',
      "contactPhone" VARCHAR(50) NOT NULL,
      "contactLine" VARCHAR(255),
      "contactFacebook" VARCHAR(255),
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "ListingImage" (
      "id" SERIAL PRIMARY KEY,
      "listingId" INTEGER NOT NULL REFERENCES "Listing"("id") ON DELETE CASCADE,
      "url" TEXT NOT NULL,
      "isCover" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  console.log('✅ All tables ("User", "Listing", "ListingImage") created on Neon successfully!');
}

migrate().catch(console.error);
