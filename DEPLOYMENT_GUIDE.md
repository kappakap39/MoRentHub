# คู่มือการติดตั้ง รันระบบ และนำขึ้นเซิร์ฟเวอร์ออนไลน์ฟรี (Deployment Guide)

คู่มือนี้จัดทำขึ้นเพื่อให้คุณสามารถรันระบบทดสอบในเครื่องคอมพิวเตอร์ของคุณเอง และนำเว็บไซต์ **"MoRentHub - แพลตฟอร์มปล่อยเช่ารถและบ้าน"** ขึ้นออนไลน์บนอินเทอร์เน็ตได้แบบ **ฟรี 100%** เพื่อให้คนทั่วไปสามารถเข้าถึงได้จากทุกที่ทั่วโลก

---

## 1. ข้อมูลเข้าสู่ระบบผู้ดูแลระบบ (Admin Credentials)

ระบบได้ตั้งค่าบัญชีเริ่มต้นที่มีการเข้ารหัสความปลอดภัย (bcrypt) ไว้อัตโนมัติ:

- **URL เข้าสู่ระบบ:** `/admin/login`
- **Username:** `admin`
- **Password:** `adminmo2026`
- **ระบบความปลอดภัย:** มีรหัสภาพสุ่ม (CAPTCHA) ป้องกันบอททุกครั้งที่เข้าสู่ระบบ
- **การเปลี่ยนข้อมูล:** เมื่อเข้าสู่ระบบแล้ว ให้ไปที่เมนู **โปรไฟล์ (Profile)** เพื่อเปลี่ยนชื่อผู้ใช้และรหัสผ่านใหม่ตามที่ต้องการได้ตลอดเวลา

---

## 2. วิธีการรันบนเครื่องคอมพิวเตอร์ (Local Development)

### วิธีที่ 1: รันด้วย Docker (ง่ายที่สุด เหมาะสำหรับทดสอบทั้งระบบ)
ตรวจสอบให้แน่ใจว่าเปิดโปรแกรม **Docker Desktop** บนเครื่องแล้ว จากนั้นเปิด Terminal ที่โฟลเดอร์โปรเจกต์ `E:\Git\Rent_cars_houses` แล้วพิมพ์คำสั่ง:

```bash
docker compose up --build
```

- **Frontend (หน้าเว็บผู้ใช้ & แอดมิน):** เข้าได้ที่ `http://localhost:3000`
- **Backend (REST API):** เข้าได้ที่ `http://localhost:5000/api`
- หากต้องการหยุดการทำงาน ให้กด `Ctrl + C` หรือพิมพ์ `docker compose down`

---

### วิธีที่ 2: รันแบบ Native Node.js (สำหรับตอนพัฒนาโค้ด)

**หน้าต่าง Terminal ที่ 1 (Backend):**
```bash
cd backend
npm run dev
```
*(Backend จะรันที่พอร์ต `http://localhost:5000`)*

**หน้าต่าง Terminal ที่ 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*(Frontend จะรันที่พอร์ต `http://localhost:3000`)*

---

## 3. วิธีนำขึ้นเซิร์ฟเวอร์ออนไลน์ฟรี (Free Online Deployment)

แนวทางที่เสถียร รวดเร็ว และเป็นที่นิยมที่สุดสำหรับเว็บระดับโลกในปัจจุบัน คือการแยก Frontend และ Backend:
- **Frontend (React + Vite):** นำขึ้น **Vercel** หรือ **Netlify** (ฟรี 100%, โหลดเร็วระดับ CDN ทั่วโลก, มี SSL HTTPS ให้ฟรี)
- **Backend (Node.js Express + Database):** นำขึ้น **Render.com** (ฟรี 100%, มี Web Service และรองรับ Docker)

---

### ขั้นตอนที่ 1: อัปโหลดโค้ดขึ้น GitHub

1. สมัครหรือเข้าสู่ระบบที่ [https://github.com](https://github.com)
2. สร้าง Repository ใหม่ เช่น ชื่อ `rent-cars-houses` (ตั้งเป็น Public หรือ Private ก็ได้)
3. ที่โฟลเดอร์โปรเจกต์ของคุณ (`E:\Git\Rent_cars_houses`) รันคำสั่ง:
   ```bash
   git init
   git add .
   git commit -m "feat: complete rent cars and houses platform"
   git branch -M main
   git remote add origin https://github.com/<ชื่อผู้ใช้GitHubของคุณ>/rent-cars-houses.git
   git push -u origin main
   ```

---

### ขั้นตอนที่ 2: นำ Backend ขึ้น Render.com (ฟรี)

1. สมัครสมาชิกที่ [https://render.com](https://render.com) (เข้าสู่ระบบด้วยบัญชี GitHub ได้ทันที)
2. ไปที่หน้า **Dashboard** แล้วคลิก **"New +"** -> เลือก **"Web Service"**
3. เลือกเชื่อมต่อกับ GitHub Repository `rent-cars-houses` ที่เพิ่งอัปโหลด
4. กำหนดการตั้งค่าดังนี้:
   - **Name:** `rent-backend` (หรือชื่อที่คุณต้องการ)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build && npx prisma db push && npm run db:seed`
   - **Start Command:** `npm run start`
   - **Instance Type:** เลือก **Free**
5. เลื่อนลงมาที่หัวข้อ **Environment Variables** และกด **Add Environment Variable**:
   - `DATABASE_URL` = `postgresql://morenthub-db_owner:npg_b3xHMjudIUt0@ep-aged-mode-b32f72iu-pooler.c-4.ap-southeast-1.aws.neon.tech/morenthub-db?sslmode=require` (ดึงอัตโนมัติจาก Neon)
   - `DATABASE_URL_UNPOOLED` = `postgresql://morenthub-db_owner:npg_b3xHMjudIUt0@ep-aged-mode-b32f72iu.c-4.ap-southeast-1.aws.neon.tech/morenthub-db?sslmode=require`
   - `JWT_SECRET` = `morenthub-super-secret-jwt-key-2026`
   - `PORT` = `5000`
6. กดปุ่ม **"Create Web Service"**
7. รอประมาณ 2-3 นาที ระบบจะทำการ Build และ Start Server เมื่อเสร็จแล้วคุณจะได้ URL เช่น:
   `https://rent-backend-xxxx.onrender.com`
   *(ทดสอบเปิด `https://rent-backend-xxxx.onrender.com/api/health` ต้องแสดงสถานะ ok)*

---

### ขั้นตอนที่ 3: นำ Frontend ขึ้น Vercel (ฟรี)

1. สมัครสมาชิกที่ [https://vercel.com](https://vercel.com) (เข้าสู่ระบบด้วยบัญชี GitHub)
2. คลิกปุ่ม **"Add New..."** -> เลือก **"Project"**
3. เลือก Repository `rent-cars-houses` แล้วคลิก **"Import"**
4. ในส่วนการตั้งค่าโปรเจกต์:
   - **Framework Preset:** เลือก `Vite`
   - **Root Directory:** กด Edit แล้วเลือกโฟลเดอร์ `frontend`
5. ในหัวข้อ **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://rent-backend-xxxx.onrender.com/api` *(ใส่ URL Backend ของคุณที่ได้จาก Render ในขั้นตอนที่ 2)*
6. กดปุ่ม **"Deploy"**
7. รอไม่ถึง 1 นาที เว็บไซต์ของคุณจะเปิดออนไลน์ทันที พร้อมได้โดเมนฟรี เช่น:
   `https://rent-cars-houses.vercel.app`

🎉 **เสร็จเรียบร้อย!** ตอนนี้คนทั่วไปสามารถเปิดเข้าชมเว็บของคุณได้จากทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์ทั่วโลกแล้ว!

---

## 4. โครงสร้างไฟล์และสถาปัตยกรรมโปรเจกต์

ระบบถูกออกแบบตามหลักสากล (Clean Modular Architecture) ไฟล์แต่ละไฟล์มีขนาดกะทัดรัด แยกส่วนการทำงานชัดเจน:

```
Rent_cars_houses/
├── backend/                  # ส่วนจัดการเซิร์ฟเวอร์และฐานข้อมูล (Node.js + TS)
│   ├── prisma/
│   │   ├── schema.prisma     # โครงสร้างตารางฐานข้อมูล (Users, Listings, Images)
│   │   └── seed.ts           # ข้อมูลเริ่มต้น (แอดมิน admin/adminmo2026 และรายการตัวอย่าง)
│   ├── src/
│   │   ├── controllers/      # ฟังก์ชันประมวลผลคำขอ (authController, listingController)
│   │   ├── middlewares/      # ตรวจสอบสิทธิ์ (authMiddleware, uploadMiddleware)
│   │   ├── routes/           # เส้นทาง API endpoints
│   │   ├── services/         # ระบบสร้างและตรวจ CAPTCHA, Prisma client
│   │   └── index.ts          # จุดเริ่มต้นรันระบบ Express API
│   ├── Dockerfile            # Docker Image สำหรับ Backend
│   └── package.json
│
├── frontend/                 # ส่วนหน้าเว็บส่วนผู้ใช้และแอดมิน (React + Vite + TS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Navbar, Footer, Modal, Badge, CaptchaInput
│   │   │   ├── listings/     # ListingCard, ListingFilter, DistanceCalculator, MapView
│   │   │   └── admin/        # ListingFormModal, StatusUpdateModal, DeleteConfirmModal
│   │   ├── pages/
│   │   │   ├── HomePage.tsx            # หน้าแสดงรายการเช่าทั้งหมด + หมวดหมู่
│   │   │   ├── ListingDetailPage.tsx   # หน้ารายละเอียด, แผนที่, วัดระยะทาง, ช่องทางติดต่อ
│   │   │   ├── AdminLoginPage.tsx      # หน้าล็อคอินพร้อม Captcha
│   │   │   ├── AdminDashboardPage.tsx  # หน้าจัดการข้อมูล CRUD + อัปเดตสถานะ
│   │   │   └── AdminProfilePage.tsx    # หน้าแก้ไข Username & Password ของแอดมิน
│   │   ├── context/          # AuthContext จัดการสถานะการเข้าสู่ระบบ
│   │   ├── services/         # api.ts จัดการการเชื่อมต่อ API ทั้งหมด
│   │   └── types/            # TypeScript Interfaces รวมศูนย์
│   ├── Dockerfile            # Multi-stage Docker build สำหรับ Frontend (Vite -> Nginx)
│   ├── nginx.conf            # Nginx config สำหรับ SPA Routing และ Proxy
│   └── tailwind.config.js    # กำหนดชุดสี Pastel Pink, Pastel Blue, White
│
├── docker-compose.yml        # รันทั้งระบบได้ในคำสั่งเดียว
└── README.md
```
