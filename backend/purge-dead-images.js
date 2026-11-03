const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);

async function cleanAllDeadImages() {
  const images = await sql`
    SELECT id, "listingId", url, "isCover"
    FROM "ListingImage"
    ORDER BY id ASC;
  `;
  console.log('Total images to check:', images.length);

  const deadIds = [];

  for (const img of images) {
    try {
      const res = await fetch(img.url);
      if (res.status === 503 || res.headers.get('content-length') === '1115') {
        deadIds.push(img.id);
        console.log(`[DEAD] Listing ${img.listingId} | ID ${img.id} | Status: ${res.status} | Size: ${res.headers.get('content-length')}`);
      }
    } catch (e) {
      console.log(`[ERROR] Listing ${img.listingId} | ID ${img.id} | ${e.message}`);
    }
  }

  console.log(`Found ${deadIds.length} dead images to delete.`);
  for (const id of deadIds) {
    await sql`DELETE FROM "ListingImage" WHERE id = ${id}`;
  }

  // Ensure each listing has an isCover
  const listings = await sql`SELECT id FROM "Listing"`;
  for (const l of listings) {
    const listImgs = await sql`SELECT id, "isCover" FROM "ListingImage" WHERE "listingId" = ${l.id} ORDER BY id ASC`;
    if (listImgs.length > 0 && !listImgs.some(i => i.isCover)) {
      await sql`UPDATE "ListingImage" SET "isCover" = true WHERE id = ${listImgs[0].id}`;
      console.log(`Set new cover for listing ${l.id}`);
    }
  }

  console.log('Done cleaning all dead images!');
}

cleanAllDeadImages();
