import { Request, Response } from 'express';
import fs from 'fs';
import prisma from '../services/prisma';

// 1. ดึงรายการทั้งหมด (Public - สำหรับหน้าแรก มีฟิลเตอร์หมวดหมู่และค้นหา)
export const getAllListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status, search } = req.query;

    const where: any = {};

    if (category && category !== 'ALL') {
      where.category = String(category).toUpperCase();
    }

    if (status && status !== 'ALL') {
      where.status = String(status).toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { locationName: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายการ' });
  }
};

// 2. ดึงรายละเอียดรายการเดี่ยว (Public - หน้าดูรายละเอียด)
export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'รหัสรายการไม่ถูกต้อง' });
      return;
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!listing) {
      res.status(404).json({ message: 'ไม่พบรายการที่ต้องการ' });
      return;
    }

    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing details:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงรายละเอียด' });
  }
};

// 3. สร้างรายการใหม่ (Admin Only)
export const createListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      title,
      description,
      price,
      priceUnit,
      status,
      rentalStartDate,
      rentalEndDate,
      locationName,
      address,
      latitude,
      longitude,
      contactName,
      contactPhone,
      contactLine,
      contactFacebook,
      images, // array of url strings
    } = req.body;

    if (!title || !category || !price || !locationName || !contactPhone) {
      res.status(400).json({ message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' });
      return;
    }

    const listing = await prisma.listing.create({
      data: {
        category: category.toUpperCase(),
        title,
        description: description || '',
        price: parseFloat(price),
        priceUnit: priceUnit || 'month',
        status: status || 'AVAILABLE',
        rentalStartDate: rentalStartDate ? new Date(rentalStartDate) : null,
        rentalEndDate: rentalEndDate ? new Date(rentalEndDate) : null,
        locationName,
        address: address || '',
        latitude: latitude ? parseFloat(latitude) : 13.7563,
        longitude: longitude ? parseFloat(longitude) : 100.5018,
        contactName: contactName || 'Admin Rental',
        contactPhone,
        contactLine: contactLine || null,
        contactFacebook: contactFacebook || null,
        images: {
          create: (images || []).map((url: string, index: number) => ({
            url,
            isCover: index === 0,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    res.status(201).json({ message: 'เพิ่มรายการสำเร็จ', listing });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างรายการ' });
  }
};

// 4. แก้ไขข้อมูลรายการ (Admin Only)
export const updateListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'รหัสรายการไม่ถูกต้อง' });
      return;
    }

    const {
      category,
      title,
      description,
      price,
      priceUnit,
      status,
      rentalStartDate,
      rentalEndDate,
      locationName,
      address,
      latitude,
      longitude,
      contactName,
      contactPhone,
      contactLine,
      contactFacebook,
      images,
    } = req.body;

    // ลบรูปภาพเดิมถ้ามีชุดใหม่ส่งเข้ามา
    if (Array.isArray(images)) {
      await prisma.listingImage.deleteMany({
        where: { listingId: id },
      });
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        category: category ? category.toUpperCase() : undefined,
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        priceUnit,
        status,
        rentalStartDate: rentalStartDate ? new Date(rentalStartDate) : null,
        rentalEndDate: rentalEndDate ? new Date(rentalEndDate) : null,
        locationName,
        address,
        latitude: latitude !== undefined ? parseFloat(latitude) : undefined,
        longitude: longitude !== undefined ? parseFloat(longitude) : undefined,
        contactName,
        contactPhone,
        contactLine,
        contactFacebook,
        images: Array.isArray(images)
          ? {
              create: images.map((url: string, index: number) => ({
                url,
                isCover: index === 0,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    res.json({ message: 'อัปเดตรายการเรียบร้อยแล้ว', listing: updatedListing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตรายการ' });
  }
};

// 5. อัปเดตเฉพาะสถานะและระยะเวลาเช่า (Quick update status & rental dates)
export const updateListingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, rentalStartDate, rentalEndDate } = req.body;

    if (!status) {
      res.status(400).json({ message: 'กรุณาระบุสถานะ' });
      return;
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        status,
        rentalStartDate: rentalStartDate ? new Date(rentalStartDate) : null,
        rentalEndDate: rentalEndDate ? new Date(rentalEndDate) : null,
      },
    });

    res.json({ message: 'อัปเดตสถานะการเช่าสำเร็จ', listing: updated });
  } catch (error) {
    console.error('Error updating listing status:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' });
  }
};

// 6. ลบรายการ (Admin Only)
export const deleteListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.listing.delete({
      where: { id },
    });
    res.json({ message: 'ลบรายการเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบรายการ' });
  }
};

// 7. อัปโหลดรูปภาพ (Admin Only)
export const uploadListingImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'ไม่มีไฟล์ที่อัปโหลด' });
      return;
    }

    const imgbbApiKey = process.env.IMGBB_API_KEY;

    // ถ้ามีการตั้งค่า IMGBB_API_KEY ให้อัปโหลดเข้า ImgBB Cloud ถาวรอัตโนมัติ
    if (imgbbApiKey) {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        try {
          const fileBuffer = fs.readFileSync(file.path);
          const base64Image = fileBuffer.toString('base64');

          const formData = new URLSearchParams();
          formData.append('key', imgbbApiKey);
          formData.append('image', base64Image);

          const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          });

          const data = (await response.json()) as any;
          if (data.success && data.data?.url) {
            uploadedUrls.push(data.data.url);
          } else {
            console.error('ImgBB API returned failure:', data);
            const host = req.get('host');
            const isHttps = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https';
            const protocol = isHttps ? 'https' : 'http';
            uploadedUrls.push(`${protocol}://${host}/uploads/${file.filename}`);
          }
        } catch (uploadErr) {
          console.error('ImgBB upload error:', uploadErr);
          const host = req.get('host');
          const isHttps = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https';
          const protocol = isHttps ? 'https' : 'http';
          uploadedUrls.push(`${protocol}://${host}/uploads/${file.filename}`);
        } finally {
          // ลบไฟล์ชั่วคราวออกจากเครื่องเซิร์ฟเวอร์
          if (fs.existsSync(file.path)) {
            try {
              fs.unlinkSync(file.path);
            } catch (_) {}
          }
        }
      }

      res.json({
        message: 'อัปโหลดขึ้นคลาวด์ ImgBB สำเร็จ (ภาพคงอยู่ถาวร)',
        urls: uploadedUrls,
      });
      return;
    }

    // กรณีไม่มี IMGBB_API_KEY ให้ใช้ local storage
    const host = req.get('host');
    const isHttps = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https';
    const protocol = isHttps ? 'https' : 'http';
    const urls = files.map((file) => `${protocol}://${host}/uploads/${file.filename}`);

    res.json({
      message: 'อัปโหลดสำเร็จ (แนะนำตั้งค่า IMGBB_API_KEY บน Render เพื่อเก็บภาพถาวร)',
      urls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' });
  }
};
