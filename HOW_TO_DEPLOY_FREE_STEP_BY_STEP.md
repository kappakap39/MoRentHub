# 📘 คู่มือฉบับสมบูรณ์: นำเว็บไซต์ขึ้นออนไลน์ฟรี 100% ถาวร (Step-by-Step Guide)
> **โปรเจกต์:** BAAN NAMPETCH PROPERTY (แพลตฟอร์มปล่อยเช่ารถและบ้าน)  
> **เทคโนโลยี:** React (Vite + TypeScript) + Node.js (Express + Prisma) + PostgreSQL (Neon)  
> **ค่าใช้จ่าย:** 0 บาท (ฟรีตลอดชีพ ไม่มีค่าบริการแอบแฝง)

---

## 📑 สารบัญ
1. [ภาพรวมสถาปัตยกรรมระบบ (System Architecture)](#1-ภาพรวมสถาปัตยกรรมระบบ-system-architecture)
2. [สิ่งที่ต้องเตรียมล่วงหน้าและบัญชีที่ต้องใช้](#2-สิ่งที่ต้องเตรียมล่วงหน้าและบัญชีที่ต้องใช้)
3. [ขั้นตอนที่ 1: เตรียมฐานข้อมูลบน Neon (PostgreSQL Cloud)](#ขั้นตอนที่-1-เตรียมฐานข้อมูลบน-neon-postgresql-cloud)
4. [ขั้นตอนที่ 2: นำซอร์สโค้ดขึ้น GitHub (Source Control)](#ขั้นตอนที่-2-นำซอร์สโค้ดขึ้น-github-source-control)
5. [ขั้นตอนที่ 3: ติดตั้งเซิร์ฟเวอร์หลังบ้าน (Backend API) บน Render](#ขั้นตอนที่-3-ติดตั้งเซิร์ฟเวอร์หลังบ้าน-backend-api-บน-render)
6. [ขั้นตอนที่ 4: ติดตั้งหน้าเว็บไซต์ (Frontend React) บน Vercel](#ขั้นตอนที่-4-ติดตั้งหน้าเว็บไซต์-frontend-react-บน-vercel)
7. [ขั้นตอนที่ 5: ตั้งค่า UptimeRobot ป้องกันเซิร์ฟเวอร์หลับ (Keep-Alive)](#ขั้นตอนที่-5-ตั้งค่า-uptimerobot-ป้องกันเซิร์ฟเวอร์หลับ-keep-alive)
8. [ขั้นตอนที่ 6: การจัดการรูปภาพอย่างมืออาชีพ (ImgBB Cloud Storage)](#ขั้นตอนที่-6-การจัดการรูปภาพอย่างมืออาชีพ-imgbb-cloud-storage)
9. [ขั้นตอนที่ 7: วิธีการอัปเดตเว็บไซต์ในอนาคต (Auto CI/CD)](#ขั้นตอนที่-7-วิธีการอัปเดตเว็บไซต์ในอนาคต-auto-cicd)
10. [สรุปตัวแปรระบบและข้อมูลสำคัญ (Cheat Sheet)](#10-สรุปตัวแปรระบบและข้อมูลสำคัญ-cheat-sheet)

---

## 1. ภาพรวมสถาปัตยกรรมระบบ (System Architecture)

ระบบถูกออกแบบด้วยสถาปัตยกรรม **Decoupled Modern Web Architecture** (แยกส่วนหน้าบ้าน หลังบ้าน และฐานข้อมูลออกจากกัน) ซึ่งเป็นมาตรฐานสากลที่องค์กรระดับโลกนิยมใช้ มีข้อดีคือ:
- **เร็วและประหยัดทรัพยากร:** หน้าบ้านโหลดเร็วระดับ Edge CDN ทั่วโลก
- **ปลอดภัย:** ฐานข้อมูลอยู่บน Cloud Isolation มีการเข้ารหัส SSL/TLS ตลอดเส้นทาง
- **แยกดูแลเป็นส่วนๆ ได้:** แก้ไขหน้าบ้านไม่ต้องหยุดเซิร์ฟเวอร์หลังบ้าน

```text
 ┌─────────────────────────────────────────────────────────┐
 │               ผู้ใช้งานทั่วไป / ลูกค้า (Client)              │
 └────────────────────────────┬────────────────────────────┘
                              │ เปิดเบราว์เซอร์เข้าชมเว็บ
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │  1. Vercel (Frontend React + Vite)                      │
 │     - โดเมน: https://xxx.vercel.app                     │
 │     - ทำหน้าที่: แสดงผลหน้าตาเว็บ, กรองข้อมูล, แผนที่, UI   │
 └────────────────────────────┬────────────────────────────┘
                              │ ส่งคำขอ API (Fetch / REST API)
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │  2. Render.com (Backend API - Express + Node.js)        │
 │     - โดเมน: https://xxx.onrender.com                   │
 │     - ทำหน้าที่: ตรวจสอบสิทธิ์แอดมิน, Captcha, ประมวลผลตรรกะ│
 └────────────────────────────┬────────────────────────────┘
                              │ ดึง/บันทึกข้อมูล (Prisma ORM)
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │  3. Neon.tech (Serverless PostgreSQL Database)          │
 │     - ที่ตั้ง Server: AWS ap-southeast-1 (Singapore)     │
 │     - ทำหน้าที่: จัดเก็บข้อมูลบัญชีผู้ใช้, ข้อมูลบ้านและรถ │
 └─────────────────────────────────────────────────────────┘
```

---

## 2. สิ่งที่ต้องเตรียมล่วงหน้าและบัญชีที่ต้องใช้

ก่อนเริ่มดำเนินการ ให้สมัครบัญชีฟรี 4 บริการนี้ (แนะนำให้ใช้อีเมลเดียวกันทั้งหมด):

| ผู้ให้บริการ | เว็บไซต์ | หน้าที่ในระบบ | ค่าใช้จ่าย |
|---|---|---|---|
| **GitHub** | [https://github.com](https://github.com) | จัดเก็บซอร์สโค้ด และเป็นตัวเชื่อมโยง Auto-Deploy | **ฟรี** |
| **Neon** | [https://neon.tech](https://neon.tech) | ฐานข้อมูล PostgreSQL Serverless จัดเก็บข้อมูลบ้าน-รถ | **ฟรี (500 MB)** |
| **Render** | [https://render.com](https://render.com) | โฮสต์รันเซิร์ฟเวอร์ Backend API (Node.js) | **ฟรี (750 ชม./เดือน)** |
| **Vercel** | [https://vercel.com](https://vercel.com) | โฮสต์หน้าเว็บ Frontend React + CDN ทั่วโลก | **ฟรี (100 GB Bandwidth)** |
| **UptimeRobot** | [https://uptimerobot.com](https://uptimerobot.com) | คอยสะกิด Backend ทุกๆ 5 นาที ไม่ให้เซิร์ฟเวอร์หลับ | **ฟรี (50 Monitors)** |

---

## ขั้นตอนที่ 1: เตรียมฐานข้อมูลบน Neon (PostgreSQL Cloud)

ฐานข้อมูล Neon เป็น Serverless Postgres ที่เสถียรและเร็วมาก โดยมีเซิร์ฟเวอร์ตั้งอยู่ที่สิงคโปร์ (ใกล้ประเทศไทยที่สุด)

### 1.1 สร้าง Project บน Neon
1. ล็อกอินเข้า [https://neon.tech](https://neon.tech)
2. คลิกปุ่ม **"New Project"**
3. ตั้งชื่อโปรเจกต์ เช่น `morenthub-db`
4. เลือก **Region:** `AWS / ap-southeast-1 (Singapore)`
5. กดปุ่ม **"Create Project"**

### 1.2 รับค่า Connection String
เมื่อสร้างเสร็จ Neon จะแสดงหน้าต่าง **Connection Details**:
- ให้เลือกแท็บ **"Prisma"** หรือ **"Node.js"**
- สังเกต Connection String จะมีหน้าตาดังนี้:
  ```text
  postgresql://<username>:<password>@<host-pooler>.neon.tech/<dbname>?sslmode=require
  ```
- คัดลอกค่านี้เก็บไว้ในสมุดโน้ต (นี่คือค่า `DATABASE_URL`)

### 1.3 สร้างโครงสร้างตาราง (Migration & Seed)
ในโปรเจกต์ของเราได้ตั้งค่า Prisma Client ผ่าน `@prisma/adapter-neon` ไว้เรียบร้อยแล้ว:
- นำ Connection String ที่ได้มาใส่ในไฟล์ `backend/.env`:
  ```env
  DATABASE_URL="postgresql://morenthub-db_owner:xxxx@ep-xxxx-pooler.neon.tech/morenthub-db?sslmode=require"
  ```
- รันคำสั่งสร้างตารางและ Seed ข้อมูลเริ่มต้นในโฟลเดอร์ `backend`:
  ```bash
  npm run build
  npx tsx prisma/seed.ts
  ```
- ผลลัพธ์: ตาราง `User`, `Listing`, `ListingImage` จะถูกสร้างบน Neon พร้อมข้อมูลบัญชีแอดมินเริ่มต้น (`admin` / `adminmo2026`) และข้อมูลตัวอย่าง 6 รายการ

---

## ขั้นตอนที่ 2: นำซอร์สโค้ดขึ้น GitHub (Source Control)

GitHub จะทำหน้าที่เป็นศูนย์กลางของโค้ด เมื่อเราอัปเดตโค้ดขึ้น GitHub ทั้ง Render และ Vercel จะดึงไปอัปเดตขึ้นเว็บจริงให้อัตโนมัติ

### 2.1 สร้าง Repository บน GitHub
1. ล็อกอินเข้า [https://github.com](https://github.com)
2. กดเครื่องหมาย **"+"** ที่มุมขวาบน -> เลือก **"New repository"**
3. กำหนดค่า:
   - **Repository name:** `MoRentHub` (หรือชื่อโปรเจกต์ของคุณ)
   - **Visibility:** เลือก `Public` (หรือ `Private` ก็ได้ ทั้ง Render และ Vercel รองรับทั้งคู่)
   - **ไม่ต้องติ๊ก** Initialize with README / .gitignore
4. กดปุ่ม **"Create repository"**

### 2.2 ส่งโค้ดจากคอมพิวเตอร์ขึ้น GitHub
เปิด Terminal หรือ PowerShell ที่โฟลเดอร์โปรเจกต์ของคุณ (`E:\Git\MoRentHub`) แล้วรันคำสั่ง:

```bash
# 1. ตรวจสอบสถานะและเปลี่ยนชื่อ branch เป็น main
git branch -M main

# 2. เชื่อมโยงกับ GitHub Repository ของคุณ
git remote add origin https://github.com/<username-ของคุณ>/MoRentHub.git

# 3. บันทึกและส่งโค้ดขึ้น GitHub
git add .
git commit -m "feat: initial complete project setup"
git push -u origin main
```

---

## ขั้นตอนที่ 3: ติดตั้งเซิร์ฟเวอร์หลังบ้าน (Backend API) บน Render

Render จะทำหน้าที่ประมวลผลคำขอ ตรวจสอบรหัสผ่านแอดมิน สร้างและตรวจสอบ Captcha และดึงข้อมูลจาก Neon Postgres

### 3.1 สร้าง Web Service
1. เข้าไปที่ [https://render.com](https://render.com) แล้วล็อกอินด้วยบัญชี **GitHub**
2. คลิกปุ่ม **"New +"** (มุมบนขวา) -> เลือก **"Web Service"**
3. จะเห็นรายชื่อ Repository จาก GitHub ให้หา `MoRentHub` แล้วคลิกปุ่ม **"Connect"**

### 3.2 ตั้งค่า Web Service
กรอกข้อมูลในแต่ละช่องดังนี้:

| ช่องที่ต้องกรอก | ค่าที่ต้องใส่ | คำอธิบาย |
|---|---|---|
| **Name** | `morenthub-api` | ชื่อเซิร์ฟเวอร์ (จะเป็นส่วนหนึ่งของ URL) |
| **Language** | `Docker` *(หรือ `Node`)* | ถ้าเลือก Docker จะอ่านคำสั่งจาก `backend/Dockerfile` อัตโนมัติ |
| **Branch** | `main` | สาขาหลักของโค้ด |
| **Region** | `Singapore` หรือ `Oregon` | แนะนำ Singapore เพราะใกล้ไทยที่สุด |
| **Root Directory** | `backend` | **สำคัญ:** ให้ระบุโฟลเดอร์ backend |
| **Instance Type** | `Free ($0/month)` | เลือกแพลนฟรี |

### 3.3 ตั้งค่า Environment Variables (ตัวแปรเชื่อมต่อ) 👈 **สำคัญมาก**
เลื่อนลงมาที่หัวข้อ **Environment Variables** แล้วกดปุ่ม **"+ Add Environment Variable"** เพิ่มทีละตัว:

1. **ตัวที่ 1 (ฐานข้อมูล):**
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://morenthub-db_owner:xxxx@ep-xxxx-pooler.neon.tech/morenthub-db?sslmode=require` *(ใส่ค่าจาก Neon)*
2. **ตัวที่ 2 (กุญแจเข้ารหัส JWT):**
   - **Key:** `JWT_SECRET`
   - **Value:** `morenthub-super-secret-jwt-key-2026` *(หรือรหัสผ่านยาวๆ ที่ตั้งเอง)*
3. **ตัวที่ 3 (พอร์ตเชื่อมต่อ):**
   - **Key:** `PORT`
   - **Value:** `5000`

### 3.4 กด Deploy และตรวจสอบ
1. กดปุ่ม **"Deploy web service"** (ปุ่มสีขาวด้านล่างสุด)
2. รอระบบทำการบิลด์ประมาณ 1-2 นาที เมื่อเสร็จแล้วจะมีจุดสีเขียวขึ้นว่า:  
   `STATUS: Deploy succeeded | Live`
3. สังเกตลิงก์ URL ประจำเซิร์ฟเวอร์ของคุณ เช่น:  
   👉 `https://morenthub-api.onrender.com`
4. **วิธีทดสอบ:** ให้ลองนำ URL ไปเปิดในเบราว์เซอร์แล้วต่อท้ายด้วย `/api/health`:  
   `https://morenthub-api.onrender.com/api/health`  
   หากแสดงผลว่า `{"status":"ok", ...}` แสดงว่าเซิร์ฟเวอร์หลังบ้านออนไลน์สมบูรณ์แล้ว!

---

## ขั้นตอนที่ 4: ติดตั้งหน้าเว็บไซต์ (Frontend React) บน Vercel

Vercel เป็นแพลตฟอร์มที่ดีและเร็วที่สุดสำหรับ React + Vite มีระบบแคช CDN กระจายทั่วโลก ทำให้เปิดเว็บได้รวดเร็วทันใจ

### 4.1 เชื่อมต่อโปรเจกต์
1. เข้าไปที่ [https://vercel.com](https://vercel.com) แล้วล็อกอินด้วย **GitHub**
2. คลิกปุ่ม **"Add New..."** -> เลือก **"Project"**
3. ในรายการ Import Git Repository ค้นหา `MoRentHub`
4. ในกรณีที่ Vercel ตรวจพบโฟลเดอร์ย่อย:
   - ให้มองหาแถว **`frontend (Vite)`**
   - คลิกปุ่ม **"Import single project →"** ด้านขวาสุดของแถว frontend

### 4.2 ตั้งค่าการเชื่อมต่อ API (Environment Variable)
1. **Framework Preset:** ให้เลือกเป็น `Vite`
2. **Root Directory:** ตรวจสอบว่าเป็น `frontend`
3. เลื่อนลงมาที่หัวข้อ **Environment Variables** (กดลูกศรคลี่ลงมา):
   - **Key:** `VITE_API_URL`
   - **Value:** `https://morenthub-api.onrender.com/api`  
     *(⚠️ นำ URL จาก Render ในขั้นตอนที่ 3 มาใส่ แล้วต้องต่อท้ายด้วย `/api` เสมอ)*
   - กดปุ่ม **"Add"**

### 4.3 กด Deploy
1. กดปุ่มสีดำ **"Deploy"**
2. รอระบบบิลด์ประมาณ 30-40 วินาที จะมีพลุเฉลิมฉลองขึ้นมา 🎉
3. คุณจะได้โดเมนจริงของเว็บไซต์มาใช้งาน เช่น:  
   👉 `https://morenthub.vercel.app` (หรือชื่อที่คุณตั้งไว้)
4. คลิกเปิดเข้าชมเว็บไซต์ได้ทันทีจากทั้งคอมพิวเตอร์และโทรศัพท์มือถือ!

> **หมายเหตุเรื่อง SPA Rewrite:**  
> ในโปรเจกต์เราได้สร้างไฟล์ `frontend/vercel.json` ไว้ให้แล้ว เพื่อป้องกันปัญหาเมื่อผู้ใช้เปิดหน้ารายละเอียดหรือหน้ารีเฟรชแล้วติด Error 404 ทำให้เข้าใช้งานได้ราบรื่น 100%

---

## ขั้นตอนที่ 5: ตั้งค่า UptimeRobot ป้องกันเซิร์ฟเวอร์หลับ (Keep-Alive)

แพลนฟรีของ Render มีข้อกำหนดว่า **หากไม่มีคนเข้าชมเว็บติดต่อกันเกิน 15 นาที เซิร์ฟเวอร์จะเข้าสู่โหมดหลับ (Idle/Spin Down)** เพื่อประหยัดพลังงาน  
เมื่อมีลูกค้าเปิดเว็บเข้ามา จะต้องรอเซิร์ฟเวอร์ตื่นประมาณ 30-50 วินาที

**วิธีแก้ฟรี:** ให้ใช้ **UptimeRobot** คอยส่งคำขอไปสะกิดเซิร์ฟเวอร์ทุก 5 นาที เพื่อให้ Backend ตื่นอยู่ตลอด 24 ชั่วโมง!

### 5.1 ขั้นตอนการตั้งค่า
1. เข้าสู่ระบบที่ [https://uptimerobot.com](https://uptimerobot.com)
2. ไปที่หน้า **Dashboard** แล้วกดปุ่มสีฟ้า **"+ New Monitor"**
3. กรอกข้อมูลดังนี้:
   - **Monitor Type:** เลือก `HTTP(s)`
   - **Friendly Name:** ตั้งชื่อ เช่น `MoRentHub API Keep-Alive`
   - **URL (or IP):** `https://morenthub-api.onrender.com/api/health` 👈 *(ใส่ URL ของ Render ที่ต่อท้ายด้วย /api/health)*
   - **Monitoring Interval:** เลือกเป็น `5 minutes` (หรือ `10 minutes`)
4. กดปุ่ม **"Create Monitor"**

เพียงเท่านี้ UptimeRobot จะยิงสัญญาณเบาๆ ไปที่ Backend ของคุณทุกๆ 5 นาที ทำให้เซิร์ฟเวอร์ Render **ไม่มีวันหลับ** และลูกค้าเปิดเว็บตอนไหนก็โหลดข้อมูลได้เร็วทันทีครับ!

---

## ขั้นตอนที่ 6: การจัดการรูปภาพอย่างมืออาชีพ (ImgBB Cloud Storage)

### ⚠️ กฎเหล็กที่ต้องจำเกี่ยวกับรูปภาพ:
- **อย่าอัปโหลดไฟล์รูปลงในเครื่อง Render โดยตรง** เพราะเซิร์ฟเวอร์ฟรีของ Render ใช้ระบบ *Ephemeral Storage* (เมื่อเซิร์ฟเวอร์รีสตาร์ทหรืออัปเดตโค้ด ไฟล์ที่อัปโหลดลงเครื่องจะหายไป)
- **วิธีที่ถูกต้องและถาวร 100%:** ให้ฝากรูปไว้ที่เว็บฝากรูปฟรี แล้วนำ **Direct URL (ลิงก์ตรง)** มาใส่ในระบบ!

### 6.1 วิธีนำรูปขึ้น ImgBB
1. เข้าไปที่ [https://imgbb.com](https://imgbb.com) (สมัครสมาชิกฟรี หรือกดอัปโหลดได้ทันที)
2. กดปุ่ม **"เริ่มการอัปโหลด"** แล้วเลือกรูปภาพบ้านหรือรถจากเครื่องของคุณ
3. ในช่อง "การลบอัตโนมัติ" ให้เลือก **"ไม่ต้องลบอัตโนมัติ"**
4. กดปุ่ม **"อัปโหลด"**

### 6.2 วิธีคัดลอก "ลิงก์ตรง (Direct Link)"
เมื่ออัปโหลดเสร็จ ในกล่องตัวเลือกลิงก์ (Embed codes):
- ให้เลือกตัวเลือก **"ลิงก์ตรง (Direct links)"**
- ลิงก์ที่ถูกต้อง **จะต้องลงท้ายด้วยนามสกุลไฟล์ภาพเสมอ** เช่น `.jpg`, `.png`, หรือ `.webp`
  - ✅ **ถูกต้อง:** `https://i.ibb.co/KpScmfcY/logo-baan-nampetch.jpg`
  - ❌ **ไม่ถูกต้อง:** `https://ibb.co/sdzptNph` *(อันนี้เป็นลิงก์หน้าเว็บ ไม่ใช่ลิงก์ภาพ)*

### 6.3 นำลิงก์ไปใช้ในเว็บ
1. เข้าหน้าเว็บของคุณแล้วไปที่หน้าเข้าสู่ระบบแอดมิน: `/admin/login`
2. ใส่ Username: `admin` และ Password: `adminmo2026` พร้อมรหัส Captcha
3. กดปุ่ม **"เพิ่มรายการใหม่"**
4. ในช่อง **"URL รูปภาพ"** ให้นำลิงก์ตรงที่ได้จาก ImgBB มาวาง (สามารถกดเพิ่มได้หลายรูป)
5. กดบันทึก -> รูปภาพจะแสดงผลอย่างสวยงาม คมชัด โหลดเร็ว และ**คงอยู่ถาวรไม่มีวันหาย**ครับ!

---

## ขั้นตอนที่ 7: วิธีการอัปเดตเว็บไซต์ในอนาคต (Auto CI/CD)

เมื่อระบบถูกผูกไว้กับ GitHub เรียบร้อยแล้ว การอัปเดตในอนาคตจะง่ายและเป็นไปโดยอัตโนมัติทั้งหมด:

### กรณีที่ 1: อัปเดตข้อมูลบ้าน/รถ/ราคา/สถานะว่างหรือไม่ว่าง
- **ไม่ต้องแก้โค้ดเลย!**
- แค่ล็อกอินแอดมินผ่านหน้าเว็บจริง แล้วกดเพิ่ม/ลบ/แก้ไขได้ทันที ข้อมูลจะบันทึกเข้า Neon Postgres และแสดงผลแบบ Real-time ทันที

### กรณีที่ 2: แก้ไขดีไซน์ หน้าตาเว็บ หรือฟังก์ชันการทำงาน (Source Code Update)
เมื่อคุณแก้ไขไฟล์โค้ดในเครื่องเสร็จแล้ว:

#### วิธีที่สะดวกที่สุด: ดับเบิลคลิกไฟล์ `update-online.bat` 🌟
1. ไปที่โฟลเดอร์โปรเจกต์ `E:\Git\MoRentHub`
2. ดับเบิลคลิกที่ไฟล์ `update-online.bat`
3. พิมพ์ข้อความสั้นๆ ว่าอัปเดตอะไร แล้วกด Enter
4. โปรแกรมจะทำการทดสอบบิลด์ และ Push ขึ้น GitHub ให้อัตโนมัติ

#### หรือพิมพ์คำสั่ง Git ด้วยตนเอง:
```bash
git add .
git commit -m "อัปเดตหน้าตาเว็บใหม่"
git push origin main
```

**ผลลัพธ์:** เมื่อโค้ดขึ้น GitHub แล้ว Vercel และ Render จะตรวจจับได้เอง แล้วทำการ Re-build + Re-deploy ขึ้นเว็บจริงให้คุณภายใน 1-2 นาทีโดยอัตโนมัติ!

---

## 10. สรุปตัวแปรระบบและข้อมูลสำคัญ (Cheat Sheet)

บันทึกหน้านี้ไว้สำหรับอ้างอิงข้อมูลสำคัญของระบบ:

```text
========================================================================
                      BAAN NAMPETCH PROPERTY
========================================================================

1. ข้อมูลเข้าสู่ระบบผู้ดูแลระบบ (Admin Credentials):
   - URL ล็อกอิน:        https://<your-vercel-domain>/admin/login
   - ชื่อผู้ใช้เริ่มต้น:     admin
   - รหัสผ่านเริ่มต้น:      adminmo2026
   (สามารถเปลี่ยนชื่อผู้ใช้และรหัสผ่านใหม่ได้ที่เมนู "โปรไฟล์" หลังล็อกอิน)

2. ค่าตัวแปรใน Render (Backend Environment Variables):
   - DATABASE_URL:       postgresql://morenthub-db_owner:xxxx@ep-xxxx-pooler.neon.tech/morenthub-db?sslmode=require
   - JWT_SECRET:         morenthub-super-secret-jwt-key-2026
   - PORT:               5000

3. ค่าตัวแปรใน Vercel (Frontend Environment Variables):
   - VITE_API_URL:       https://morenthub-api.onrender.com/api

4. ค่าใน UptimeRobot (Keep-Alive Monitor):
   - Monitor URL:        https://morenthub-api.onrender.com/api/health
   - Interval:           5 minutes
========================================================================
```

---
*จัดทำขึ้นเพื่อให้การดูแลรักษาและส่งต่อระบบทำได้อย่างราบรื่นและมืออาชีพ*
