const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);

async function inspectLatest() {
  const listings = await sql`
    SELECT id, title, "locationName", address, "mapUrl", latitude, longitude, "createdAt"
    FROM "Listing"
    ORDER BY id DESC
    LIMIT 5;
  `;
  console.log('Latest listings:');
  console.log(JSON.stringify(listings, null, 2));

  if (listings.length > 0) {
    const latestId = listings[0].id;
    const images = await sql`
      SELECT id, url, "isCover"
      FROM "ListingImage"
      WHERE "listingId" = ${latestId}
      ORDER BY id ASC;
    `;
    console.log(`Images for listing ${latestId} (${listings[0].title}):`);
    console.log(JSON.stringify(images, null, 2));
  }
}

inspectLatest();
