const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);

async function updateAllCoords() {
  const updates = [
    { id: 7, lat: 12.6155991, lng: 99.9512898 },
    { id: 8, lat: 12.2385161, lng: 99.9776524 },
    { id: 9, lat: 12.4199567, lng: 99.9309557 },
    { id: 10, lat: 12.7001312, lng: 99.9390511 },
    { id: 11, lat: 12.577012, lng: 99.897045 },
    { id: 12, lat: 12.4670468, lng: 99.8950284 },
    { id: 13, lat: 12.554592, lng: 99.910963 },
    { id: 14, lat: 12.482015, lng: 99.915024 },
    { id: 15, lat: 12.660574, lng: 99.941657 },
    { id: 16, lat: 12.4670468, lng: 99.8950284 },
    { id: 17, lat: 12.662345, lng: 99.944468 },
  ];

  for (const u of updates) {
    await sql`
      UPDATE "Listing"
      SET latitude = ${u.lat},
          longitude = ${u.lng}
      WHERE id = ${u.id}
    `;
    console.log(`Updated Listing ${u.id} to Lat: ${u.lat}, Lng: ${u.lng}`);
  }

  const rows = await sql`SELECT id, title, "mapUrl", latitude, longitude FROM "Listing" ORDER BY id ASC`;
  console.log('All listings updated in DB:');
  console.table(rows);
}

updateAllCoords();
