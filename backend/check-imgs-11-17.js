const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);

async function checkImages11to17() {
  const images = await sql`
    SELECT id, "listingId", url, "isCover"
    FROM "ListingImage"
    WHERE "listingId" >= 11
    ORDER BY "listingId" ASC, id ASC;
  `;
  console.log('Total images in 11..17:', images.length);
  const byListing = {};
  for (const img of images) {
    if (!byListing[img.listingId]) byListing[img.listingId] = { total: 0, bad: 0, badUrls: [] };
    byListing[img.listingId].total++;
    try {
      const res = await fetch(img.url);
      if (res.status !== 200 || res.headers.get('content-length') === '1115') {
        byListing[img.listingId].bad++;
        byListing[img.listingId].badUrls.push({ id: img.id, url: img.url, status: res.status, size: res.headers.get('content-length') });
      }
    } catch (e) {
      byListing[img.listingId].bad++;
      byListing[img.listingId].badUrls.push({ id: img.id, url: img.url, error: e.message });
    }
  }
  console.log(JSON.stringify(byListing, null, 2));
}

checkImages11to17();
