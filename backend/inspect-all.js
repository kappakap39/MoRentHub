const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);

async function inspectAll() {
  const listings = await sql`
    SELECT id, title, "locationName", address, "mapUrl", latitude, longitude
    FROM "Listing"
    ORDER BY id ASC;
  `;
  console.log('Total listings in DB:', listings.length);
  for (const l of listings) {
    console.log(`[ID ${l.id}] ${l.title} | mapUrl: ${l.mapUrl} | Lat: ${l.latitude}, Lng: ${l.longitude}`);
  }
}

inspectAll();
