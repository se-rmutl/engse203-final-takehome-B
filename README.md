# ระบบประกาศข่าวคณะ (Faculty News) — ENGSE203 Final Part 1 · ชุด B

เจ้าหน้าที่ของคณะเผยแพร่ประกาศ · ใครก็อ่านประกาศที่เผยแพร่แล้วได้โดยไม่ต้องเข้าสู่ระบบ
**React 19 + Vite** · **Express 5** · **SQLite (`node:sqlite`)** · **JWT**

> โจทย์และเกณฑ์อยู่ใน [`TAKEHOME_B.md`](TAKEHOME_B.md) · อาการที่ผู้ใช้แจ้งอยู่ใน [`BUG_REPORTS.md`](BUG_REPORTS.md)

## โครงสร้าง

```
├── api/                      Express API (พอร์ต 3001)
│   ├── data/schema.sql       โครงสร้างตาราง + ข้อมูลตั้งต้น (users · categories · announcements)
│   ├── src/
│   │   ├── app.js            createApp() — ประกอบ middleware และ route
│   │   ├── config.js         ค่า config ทั้งหมด (อ่านจาก env)
│   │   ├── server.js         จุดเริ่มรันจริง
│   │   ├── routes/ → controllers/ → services/   (route → controller → service → SQLite)
│   │   ├── middleware/       auth (401/403) · validateAnnouncement · errorHandler
│   │   ├── validators/       pure function ตรวจข้อมูล
│   │   └── utils/password.js scrypt hash
│   └── tests/                unit/ · integration/ · helpers/auth.js
└── frontend/                 React + Vite (พอร์ต 5173)
    └── src/
        ├── pages/            หน้าประกาศ · รายละเอียด · เข้าสู่ระบบ · จัดการประกาศ · ฟอร์ม
        ├── services/         apiClient (ที่เดียวที่เรียก fetch) · authStore (token ใน localStorage)
        └── utils/            pure function + test: token.js · permissions.js · visibility.js
```

## ติดตั้งและรัน (development)

ต้องใช้ Node.js 22.13 ขึ้นไป (`node -v`)

```bash
# ติดตั้ง
npm install --prefix api
npm install --prefix frontend

# API (terminal ที่ 1)
cd api
cp .env.example .env
npm run db:setup        # สร้าง api/data/news.db จาก schema.sql (npm run db:reset = เริ่มใหม่จากข้อมูลตั้งต้น)
npm run dev             # http://localhost:3001

# Frontend (terminal ที่ 2)
cd frontend
npm run dev             # http://localhost:5173
```

## บัญชีเจ้าหน้าที่สำหรับพัฒนา (อยู่ใน `schema.sql` เป็น hash)

| อีเมล | รหัสผ่าน | ชื่อที่แสดง |
|---|---|---|
| `news@eng.rmutl.ac.th` | `news1234` | ฝ่ายข่าว คณะวิศวกรรมศาสตร์ |
| `academic@eng.rmutl.ac.th` | `news1234` | งานวิชาการ คณะวิศวกรรมศาสตร์ |

```bash
curl -X POST localhost:3001/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"news@eng.rmutl.ac.th","password":"news1234"}'
# → { "token": "eyJ...", "user": { "id": 1, "name": "...", "role": "staff" } }
```

## API

| Method | Path | สิทธิ์ | คำอธิบาย |
|---|---|---|---|
| GET | `/api/health` | ทุกคน | สถานะระบบและฐานข้อมูล |
| POST | `/api/auth/login` | ทุกคน | `{ email, password }` → `{ token, user }` · ผิด → 401 ข้อความเดียวกันเสมอ |
| GET | `/api/categories` | ทุกคน | หมวดหมู่ทั้งหมด `[{ id, name }]` |
| GET | `/api/announcements` | ทุกคน | ประกาศที่เผยแพร่แล้ว |
| GET | `/api/announcements/:id` | ทุกคน | ประกาศหนึ่งรายการ · ยังไม่เผยแพร่ / ไม่มี → 404 |
| GET | `/api/admin/announcements` | เจ้าหน้าที่ | ประกาศทุกสถานะ |
| POST | `/api/announcements` | เจ้าหน้าที่ | สร้างประกาศ → 201 |
| PUT | `/api/announcements/:id` | เจ้าหน้าที่ | แก้ไขประกาศ (ส่งครบทุกช่องเหมือน POST) → 200 |
| DELETE | `/api/announcements/:id` | เจ้าหน้าที่ | ลบประกาศ → 204 |

**รูปข้อมูลประกาศ:** `{ id, title, body, categoryId, categoryName, status, publishAt, authorName, createdAt }`

**ข้อมูลที่ POST / PUT รับ:** `{ title (5–150), body (20–5000), categoryId (รหัสหมวดหมู่), status ('draft' | 'published' | 'archived'), publishAt (ISO 8601 พร้อมเขตเวลา เช่น "2026-10-08T09:00:00+07:00") }`
· `authorName` มาจากบัญชีที่เข้าสู่ระบบ (ส่งมาเองไม่มีผล)

**มาตรฐาน status code ของระบบ**

| สถานการณ์ | status | body |
|---|---|---|
| ข้อมูลใน body / query string ที่ผู้ใช้ส่งมาไม่ถูกต้อง (ทุกกรณี) | **400** | `{ "error": "...", "errors": ["...", ...] }` |
| ไม่มี token · token ปลอม/ถูกแก้/หมดอายุ | **401** | `{ "error": "..." }` + header `WWW-Authenticate` |
| เข้าสู่ระบบแล้วแต่ไม่ใช่เจ้าหน้าที่ | **403** | `{ "error": "..." }` |
| ไม่พบข้อมูล | **404** | `{ "error": "..." }` |
| body ใหญ่เกิน 10kb | **413** | `{ "error": "..." }` |
| ผิดพลาดภายในที่ไม่คาดคิด — ข้อมูลจากผู้ใช้**ต้องไม่**ทำให้เกิด 500 | 500 | production ไม่ส่ง stack trace |

## การทดสอบ

```bash
npm test --prefix api          # Vitest + supertest · ฐานข้อมูลในหน่วยความจำ (DB_FILE=:memory:)
npm test --prefix frontend     # Vitest · pure function ใน src/utils
npm run coverage --prefix api  # รายงาน coverage → api/coverage/index.html
```

> `npm test` ที่โฟลเดอร์บนสุดรัน api แล้วตามด้วย frontend **เฉพาะเมื่อ api ผ่านทั้งหมด** — ช่วงที่ยังทำไม่เสร็จให้รันแยกสองคำสั่งด้านบน

## Environment Variables (api)

| ตัวแปร | ค่าเริ่มต้น | ความหมาย |
|---|---|---|
| `NODE_ENV` | development | สภาพแวดล้อม |
| `PORT` | 3001 | พอร์ต API |
| `CORS_ORIGIN` | http://localhost:5173 | ที่อยู่ frontend ที่อนุญาต |
| `DB_FILE` | api/data/news.db | ไฟล์ฐานข้อมูล |

## การใช้ AI

> **นักศึกษาต้องกรอกหัวข้อนี้เอง** (ดูกติกาใน `TAKEHOME_B.md`) — ใช้เครื่องมืออะไร · ใช้ทำงานข้อไหน · prompt หลักที่ใช้ · ส่วนไหนที่แก้เองหลังจาก AI ตอบ
> ถ้าไม่ได้ใช้ ให้เขียนว่า "ไม่ได้ใช้"

กรอก**แยกรายคน**

### @github-คนที่-1

- เครื่องมือ:
- ใช้กับงาน:
- สิ่งที่ตรวจ/แก้เองหลังได้คำตอบ:

### @github-คนที่-2

- เครื่องมือ:
- ใช้กับงาน:
- สิ่งที่ตรวจ/แก้เองหลังได้คำตอบ:
