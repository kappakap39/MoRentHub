import prisma from '../src/services/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create or update Default Admin account
  const defaultUsername = 'admin';
  const defaultPassword = 'adminmo2026';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.user.upsert({
    where: { username: defaultUsername },
    update: {
      password: hashedPassword,
      name: 'ผู้ดูแลระบบ (Admin)',
    },
    create: {
      username: defaultUsername,
      password: hashedPassword,
      name: 'ผู้ดูแลระบบ (Admin)',
    },
  });

  console.log(`✅ Admin account created/verified: ${admin.username} (password: ${defaultPassword})`);

  // Clear existing sample listings to avoid duplicates on re-seed
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();

  // 2. Sample Listings
  const sampleListings = [
    {
      category: 'HOUSE',
      title: 'บ้านเดี่ยวพูลวิลล่าสไตล์โมเดิร์น เชียงใหม่ หางดง',
      description: 'บ้านเดี่ยวสไตล์โมเดิร์น มินิมอล 2 ชั้น 3 ห้องนอน 3 ห้องน้ำ พร้อมสระว่ายน้ำส่วนตัว เฟอร์นิเจอร์ครบชุดพร้อมเข้าอยู่ บรรยากาศเงียบสงบ ใกล้โรงเรียนนานาชาติและห้างสรรพสินค้า',
      price: 35000,
      priceUnit: 'month',
      status: 'AVAILABLE',
      rentalStartDate: new Date('2026-03-01'),
      rentalEndDate: new Date('2027-02-28'),
      locationName: 'ต.สันผักหวาน อ.หางดง จ.เชียงใหม่',
      address: '123/45 หมู่บ้านธารารมณ์ ต.สันผักหวาน อ.หางดง จ.เชียงใหม่ 50230',
      latitude: 18.7183,
      longitude: 98.9634,
      contactName: 'คุณแอดมิน โมบาย',
      contactPhone: '089-123-4567',
      contactLine: '@adminrental2026',
      contactFacebook: 'RentCarsHousesOfficial',
      images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      category: 'HOUSE',
      title: 'คอนโดหรูใจกลางสุขุมวิท วิวพาโนรามา BTS พร้อมพงษ์',
      description: 'คอนโด Luxury High-Rise ชั้น 28 ขนาด 65 ตร.ม. 2 ห้องนอน 2 ห้องน้ำ ตกแต่งสไตล์ Luxury Modern ด้วยวัสดุเกรดพรีเมียม เดินทางสะดวกเพียง 300 เมตรจาก BTS พร้อมพงษ์ ใกล้ EmQuartier',
      price: 45000,
      priceUnit: 'month',
      status: 'RENTED',
      rentalStartDate: new Date('2026-01-15'),
      rentalEndDate: new Date('2026-07-15'),
      locationName: 'สุขุมวิท 39 คลองเตย กรุงเทพมหานคร',
      address: '88/9 คอนโด The Prime สุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
      latitude: 13.7314,
      longitude: 100.5705,
      contactName: 'คุณแอดมิน โมบาย',
      contactPhone: '089-123-4567',
      contactLine: '@adminrental2026',
      contactFacebook: 'RentCarsHousesOfficial',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      category: 'HOUSE',
      title: 'พูลวิลล่าริมทะเล ชะอำ-หัวหิน เหมาะสำหรับพักผ่อนระยะยาว',
      description: 'บ้านพักตากอากาศติดชายหาดส่วนตัว 4 ห้องนอน 5 ห้องน้ำ ลานบาร์บีคิว สวนร่มรื่น วิวทะเล 180 องศา ระบบรักษาความปลอดภัย 24 ชม.',
      price: 65000,
      priceUnit: 'month',
      status: 'AVAILABLE',
      rentalStartDate: new Date('2026-04-01'),
      rentalEndDate: new Date('2027-03-31'),
      locationName: 'หาดชะอำ จ.เพชรบุรี (ใกล้หัวหิน)',
      address: '55 หมู่ 2 ถนนเลียบชายหาด ต.ชะอำ อ.ชะอำ จ.เพชรบุรี 76120',
      latitude: 12.8025,
      longitude: 99.9806,
      contactName: 'คุณแอดมิน โมบาย',
      contactPhone: '089-123-4567',
      contactLine: '@adminrental2026',
      contactFacebook: 'RentCarsHousesOfficial',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      category: 'CAR',
      title: 'Toyota Camry 2.5 HEV Premium Luxury ปี 2024',
      description: 'รถซีดานพรีเมียม ประหยัดน้ำมันด้วยระบบไฮบริด เบาะหนังแท้ปรับไฟฟ้า ระบบเสียง JBL หลังคาพาโนรามิคซันรูฟ สภาพป้ายแดง เช็คศูนย์สม่ำเสมอ ประกันภัยชั้น 1 ครบถ้วน',
      price: 2500,
      priceUnit: 'day',
      status: 'AVAILABLE',
      rentalStartDate: new Date('2026-03-01'),
      rentalEndDate: new Date('2026-04-30'),
      locationName: 'จุดรับรถ สนามบินสุวรรณภูมิ / ดอนเมือง',
      address: 'สนามบินสุวรรณภูมิ ต.หนองปรือ อ.บางพลี จ.สมุทรปราการ 10540',
      latitude: 13.6900,
      longitude: 100.7501,
      contactName: 'คุณแอดมิน โมบาย',
      contactPhone: '089-123-4567',
      contactLine: '@adminrental2026',
      contactFacebook: 'RentCarsHousesOfficial',
      images: [
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      category: 'CAR',
      title: 'Tesla Model Y Long Range AWD ไฟฟ้า 100%',
      description: 'รถยนต์ SUV พลังงานไฟฟ้า 100% ขับเคลื่อน 4 ล้อ ชาร์จเต็มวิ่งได้กว่า 500 กม. หลังคากระจก Full Glass Roof รองรับ Autopilot ขับสนุก นุ่มเงียบ สะอาด ไร้มลพิษ พร้อมหัวชาร์จพกพา',
      price: 3900,
      priceUnit: 'day',
      status: 'RENTED',
      rentalStartDate: new Date('2026-02-20'),
      rentalEndDate: new Date('2026-03-10'),
      locationName: 'สยามสแควร์ ปทุมวัน กรุงเทพฯ',
      address: 'ศูนย์การค้าสยามพารากอน แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330',
      latitude: 13.7466,
      longitude: 100.5348,
      contactName: 'คุณแอดมิน โมบาย',
      contactPhone: '089-123-4567',
      contactLine: '@adminrental2026',
      contactFacebook: 'RentCarsHousesOfficial',
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      category: 'CAR',
      title: 'Honda CR-V e:HEV RS 4WD รถ SUV ครอบครัว 7 ที่นั่ง',
      description: 'รถครอบครัวอเนกประสงค์ 7 ที่นั่ง เครื่องยนต์ e:HEV ไฮบริดแรงและประหยัด พื้นที่เก็บสัมภาระกว้างขวาง ระบบความปลอดภัย Honda SENSING รอบคัน เหมาะสำหรับการเดินทางท่องเที่ยว',
      price: 3200,
      priceUnit: 'day',
      status: 'AVAILABLE',
      rentalStartDate: new Date('2026-03-05'),
      rentalEndDate: new Date('2026-05-30'),
      locationName: 'จุดรับรถ สนามบินเชียงใหม่',
      address: 'ท่าอากาศยานเชียงใหม่ 60 ถนนมหิดล ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200',
      latitude: 18.7677,
      longitude: 98.9640,
      contactName: 'คุณแอดมิน โมบาย',
      contactPhone: '089-123-4567',
      contactLine: '@adminrental2026',
      contactFacebook: 'RentCarsHousesOfficial',
      images: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      ],
    },
  ];

  for (const item of sampleListings) {
    const { images, ...listingData } = item;
    await prisma.listing.create({
      data: {
        ...listingData,
        images: {
          create: images.map((url, index) => ({
            url,
            isCover: index === 0,
          })),
        },
      },
    });
  }

  console.log(`✅ Seeded ${sampleListings.length} listings (Cars & Houses) successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
