@echo off
chcp 65001 >nul
echo ===================================================
echo   BAAN NAMPETCH PROPERTY - Auto Deploy to Online
echo ===================================================
echo.
set /p msg="กรุณาพิมพ์ข้อความว่าอัปเดตอะไร (เช่น แก้ไขหน้าแรก, เพิ่มฟีเจอร์): "
if "%msg%"=="" set msg=Update website changes

echo.
echo [1/3] กำลังตรวจสอบและ Build โค้ด...
call npm.cmd run build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build ไม่ผ่าน! กรุณาตรวจสอบโค้ดก่อนส่งขึ้นออนไลน์
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] กำลังบันทึกการเปลี่ยนแปลง (Git Commit)...
git add .
git commit -m "%msg%"

echo.
echo [3/3] กำลังส่งโค้ดขึ้น GitHub...
git push origin main

echo.
echo ===================================================
echo [SUCCESS] ส่งโค้ดขึ้น GitHub สำเร็จแล้ว!
echo Vercel และ Render จะทำการอัปเดตเว็บจริงบนออนไลน์ให้อัตโนมัติทันที
echo (ใช้เวลาประมาณ 1-2 นาที เว็บจริงจะเปลี่ยนตามโค้ดใหม่)
echo ===================================================
pause
