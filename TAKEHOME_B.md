# ENGSE203 สอบปลายภาค Part 1 (Take-Home) · ชุด B · Section 2

**ระบบประกาศข่าวคณะ (Faculty News)**

| | |
|---|---|
| ผู้ทำ | **ทีม — ทีมเดียวกับ Final Term Project** (pair programming) · ทุกงานมีเจ้าของตามบทบาท (หัวข้อ 3.1) |
| ปล่อยโจทย์ | พฤหัสบดี 8 ต.ค. 2569 |
| ส่ง | ก่อน**เวลาเริ่มสอบของ Section 2 วันพฤหัสบดี 22 ต.ค. 2569** (ดูวิธีส่งในหัวข้อ 7) |
| เวลาที่ใช้โดยประมาณ | 4–6 ชั่วโมง (สำหรับผู้ที่ทำ LAB 12–13 ได้) |
| คะแนน | 5 คะแนนของ A7 (สอบปลายภาค 15) · **คิดรายบุคคล** จากงานที่เป็นเจ้าของ 60% + ผลรวมของทีม 40% (หัวข้อ 3.1) แล้วคูณ 0.05 |
| สัมภาษณ์ | วันสอบ — ถามรายคนตามบทบาท ต้องอธิบายและสาธิตงานที่ตัวเองเป็นเจ้าของได้ (หัวข้อ 8) |

---

## 1. เรื่องราว

คณะวิศวกรรมศาสตร์ใช้ระบบประกาศข่าวนี้แทนบอร์ดหน้าตึก เจ้าหน้าที่หลายหน่วยงานเข้าสู่ระบบเพื่อสร้าง แก้ไข และลบประกาศ
ส่วนนักศึกษาและบุคคลทั่วไปเปิดอ่านประกาศที่เผยแพร่แล้วได้โดยไม่ต้องเข้าสู่ระบบ

ผู้พัฒนาคนเดิมย้ายไปทำโครงการอื่น คุณได้รับมอบหมายให้ดูแลระบบต่อ ก่อนเปิดใช้งานจริงมีงานค้าง 3 กลุ่ม

1. **ผู้ใช้แจ้งปัญหา 3 เรื่อง** และ **ทีมตรวจความปลอดภัยส่งข้อความมา 1 ฉบับ** → อ่านใน [`BUG_REPORTS.md`](BUG_REPORTS.md)
2. **ฟีเจอร์ใหม่ที่ฝ่ายข่าวขอ** — ตั้งเวลาเผยแพร่ล่วงหน้า และกรองประกาศตามหมวดหมู่ (หัวข้อ 4)
3. **หลักฐาน** — regression test ของทุกเรื่องที่แก้ และบันทึกการไล่ปัญหาใน `DEBUG_LOG.md`

ระบบรันได้และเข้าสู่ระบบได้ตามปกติ ปัญหาเกิดเฉพาะบางกรณี — ต้องทำให้เกิดซ้ำเองก่อน

## 2. เริ่มต้น

```bash
# 1) คนหนึ่งในทีมสร้าง repository ของทีมจาก template นี้ (ดูหัวข้อ 7) · เพิ่มเพื่อนเป็น collaborator · แล้วทุกคน clone
git clone <URL repo ของทีม> engse203-takehome-b
cd engse203-takehome-b

# 2) ติดตั้ง
npm install --prefix api
npm install --prefix frontend

# 3) รัน test ของ starter — ควรได้ตามตารางด้านล่าง
npm test --prefix api
npm test --prefix frontend

# 4) รันระบบ (2 terminal)
cd api && cp .env.example .env && npm run db:setup && npm run dev      # http://localhost:3001
cd frontend && npm run dev                                              # http://localhost:5173

# 5) กรอก team.json แล้ว commit เป็นอย่างแรก (หัวข้อ 3.1)
git add team.json && git commit -m "chore: team.json"
```

**ผล test ของ starter (ก่อนเริ่มทำ)**

| ส่วน | ทั้งหมด | ผ่าน | ไม่ผ่าน | ที่ไม่ผ่านคือ |
|---|---:|---:|---:|---|
| api | 75 | 72 | **3** | `api/tests/integration/schedule.api.test.js` (test สเปกของ FEAT) |
| frontend | 13 | 11 | **2** | `frontend/src/utils/visibility.test.js` (test สเปกของ FEAT) |

test อื่นทั้งหมดผ่าน — **แปลว่า test ที่มีอยู่ยังจับ bug ทั้ง 3 เรื่องไม่ได้** คุณต้องเขียน test ที่จับได้เอง

บัญชีเจ้าหน้าที่สำหรับพัฒนา: `news@eng.rmutl.ac.th` และ `academic@eng.rmutl.ac.th` รหัสผ่าน `news1234` ทั้งคู่ (ดู `README.md`)

## 3. งานและคะแนน

| รหัส | งาน | คะแนน | ตรวจด้วย |
|---|---|---:|---|
| **BUG-1** | แก้ปัญหาข้อ BUG-1 ใน `BUG_REPORTS.md` | 15 | hidden test + regression test ของคุณ |
| **BUG-2** | แก้ปัญหาข้อ BUG-2 | 15 | hidden test (401/403) |
| **BUG-3** | แก้ปัญหาข้อ BUG-3 | 15 | hidden test ของ pure function ฝั่ง frontend |
| **SEC** | แก้ทุกข้อที่ทีมตรวจความปลอดภัยแจ้ง | 15 | grader (ไฟล์ที่ track · `.gitignore` · `.env.example` · fail fast) + hidden test |
| **FEAT** | ตั้งเวลาเผยแพร่ + กรองตามหมวดหมู่ (หัวข้อ 4) | 20 | test สเปกที่ให้ (5 ข้อ) + hidden test |
| **TEST** | test ที่ทีมเขียนเพิ่ม — regression ของ BUG-1 · BUG-2 (`api/`) · BUG-3 (`frontend/`) + ของ FEAT ฝั่งละ 1 · ข้อละ 2 คะแนน (`api/` สูงสุด 6 · `frontend/` สูงสุด 4) | 10 | นับ test ใหม่ที่ผ่านบนงานทีมแต่ fail บน starter |
| **LOG** | `DEBUG_LOG.md` ครบ 3 bug × 6 ช่อง + หัวข้อ "ความลับ (SEC)" | 10 | grader นับช่อง + ผู้สอนอ่าน |
| | **รวม** | **100** | |

### สิ่งที่ต้องทำในแต่ละ bug (BUG-1 · BUG-2 · BUG-3)

1. **ทำซ้ำ** ให้ได้ก่อน — จดคำสั่ง/ขั้นตอนที่ทำให้เกิดอาการทุกครั้ง
2. **หาสาเหตุด้วยเครื่องมือ** ที่เหมาะกับอาการ (stack trace ใน terminal · `curl` · integration test · DevTools Console/Network/Application · breakpoint) — ระบุ**ไฟล์:บรรทัด**ที่เป็นต้นเหตุ
3. **เขียน regression test ก่อนแก้** — test ต้อง fail กับโค้ดเดิม แล้วผ่านหลังแก้
4. **แก้ที่ต้นเหตุ** (ไม่ใช่ปิดอาการ เช่น จับ error แล้วเปลี่ยนเป็น 400 ทุกกรณี หรือซ่อนปุ่มเพิ่ม)
5. **บันทึก** ใน `DEBUG_LOG.md` ครบ 6 ช่อง

พฤติกรรมที่ถูกต้องของระบบดูได้จากหัวข้อ "API" และ "มาตรฐาน status code ของระบบ" ใน `README.md`
และสำหรับฝั่ง frontend: **เจ้าหน้าที่ทุกบัญชีต้องเห็นชื่อของตัวเองถูกต้องและเห็นปุ่มจัดการประกาศ** ·
`decodeTokenPayload(token)` ต้องคืน payload ตรงกับที่ API ใส่ไว้ทุกตัวอักษร และคืน `null` เฉพาะ token ที่เสียจริงเท่านั้น

### SEC — ผลที่ต้องได้

- secret ที่ใช้เซ็น token ต้อง**มาจาก environment variable `JWT_SECRET` เท่านั้น** และไม่ถูกเปิดเผยผ่านช่องทางใด (โค้ด · log · ไฟล์ใน repo)
- `NODE_ENV=production` แต่ไม่ได้ตั้ง `JWT_SECRET` → ระบบ**ต้องไม่ start** และข้อความ error ต้องบอกว่าขาด `JWT_SECRET` (fail fast) · dev/test ยังรันได้โดยไม่ต้องตั้ง
- token ที่ออกให้ต้อง**มีวันหมดอายุ** (แนะนำ 2 ชั่วโมง ปรับได้ด้วย `JWT_EXPIRES_IN`)
- `api/.env.example` มีบรรทัด `JWT_SECRET=` (ค่าว่าง ห้ามใส่ค่าจริง) · `.env` ต้องไม่ถูก commit
- **ค่า secret เดิมต้องไม่ปรากฏในไฟล์ใดของ repo** (รวม `DEBUG_LOG.md` และ README — เวลาอ้างถึงให้เขียนว่า "ค่า secret เดิม")
- `DEBUG_LOG.md` หัวข้อ "ความลับ (SEC)" อธิบายว่าทำไมการลบออกจากโค้ดแล้ว commit ใหม่**ยังไม่พอ** และต้องทำอะไรกับ secret เดิม

## 3.1 ทีมและเจ้าของงาน

ทำเป็น**ทีมเดียวกับ Final Term Project** (คู่ หรือกลุ่ม 3 คน) — **ทีมละ 1 repo** · ช่วยกันแบบ **pair programming** ได้ตลอด (คนพิมพ์ = *driver* · คนช่วยคิดและตรวจ = *navigator*) แต่**ทุกงานมีเจ้าของ 1 คนตามบทบาท** — เจ้าของเป็นคน commit งานนั้น ตอบคำถามเรื่องนั้นในการสัมภาษณ์ และคะแนนงานนั้นเป็นของเจ้าของ

| งาน | ทีมคู่ | ทีม 3 คน |
|---|---|---|
| BUG-1 · BUG-2 · FEAT ส่วน API (`api/`) | Back-end + DevOps | Back-end |
| SEC | Back-end + DevOps | **DevOps** |
| BUG-3 · FEAT ส่วนหน้าเว็บ (`frontend/`) | Front-end | Front-end |
| TEST — test ใหม่ใต้ `api/` (2 คะแนน/ข้อ · สูงสุด 6) | Back-end + DevOps | Back-end |
| TEST — test ใหม่ใต้ `frontend/` (2 คะแนน/ข้อ · สูงสุด 4) | Front-end | Front-end |
| LOG — หัวข้อของ bug ไหน เป็นของเจ้าของ bug นั้น (BUG-1 · BUG-2 · BUG-3 หัวข้อละ 3 · SEC 1) | ตามเจ้าของ | ตามเจ้าของ |
| **OPS** (ทีม 3 คนเท่านั้น · +10) — CI ที่ root ของ repo `.github/workflows/*.yml` ทำงานเมื่อ `push` และรัน `npm test` (5) กับ `npm run build` (3) · `README.md` มีหัวข้อวิธีรันแบบ production ที่ระบุ `JWT_SECRET` และคำสั่ง start (2) | — | **DevOps** |

### คะแนนรายบุคคล

```
own%  = คะแนนที่ได้ในงานของตัวเอง ÷ คะแนนเต็มของงานของตัวเอง
team% = คะแนนรวมของทีม ÷ คะแนนเต็มของทีม (100 · ทีม 3 คน 110)
คะแนนของคุณ (เต็ม 100) = 100 × (0.6 × own% + 0.4 × team%)   → × 0.05 = คะแนน A7 ส่วนนี้ (เต็ม 5)
```

ตัวอย่าง (ทีมคู่): Back-end + DevOps ทำงานของตัวเองได้ 90% · Front-end ได้ 60% · ทีมได้รวม 81 → Back-end + DevOps = 100 × (0.6 × 0.90 + 0.4 × 0.81) = **86.4** · Front-end = 100 × (0.6 × 0.60 + 0.4 × 0.81) = **68.4**
→ ช่วยเพื่อนให้งานของเพื่อนผ่าน = คะแนนของคุณขึ้นด้วย (ส่วน 0.4) · แต่ส่วนใหญ่ (0.6) มาจากงานที่คุณรับผิดชอบเอง

### หลักฐานว่าใครทำอะไร (ต้องมีครบ)

1. **`team.json`** ที่ root — กรอกแล้ว commit **เป็นอย่างแรก**ก่อนเริ่มงาน

   ```json
   {
     "team": "ชื่อทีม (เดียวกับ Term Project)",
     "section": 1,
     "projectRepo": "https://github.com/<owner>/engse203-final-1-T07",
     "members": [
       { "name": "ชื่อ นามสกุล", "studentId": "6xxxxxxxxxx-x", "github": "username", "email": "อีเมลที่ใช้ commit", "role": "fe" },
       { "name": "ชื่อ นามสกุล", "studentId": "6xxxxxxxxxx-x", "github": "username", "email": "อีเมลที่ใช้ commit", "role": "be+devops" }
     ]
   }
   ```

   - `github` ไม่ต้องมี `@` · `email` = ผลของ `git config user.email` ในเครื่องของคนนั้น (ใช้จับคู่ commit กับคน)
   - **ทีม 3 คน**: เพิ่มสมาชิกคนที่ 3 และใช้ `role` เป็น `fe` · `be` · `devops`
2. **commit โดยเจ้าของงาน** — ข้อความขึ้นต้นด้วยรหัสงาน · navigator ใส่ `Co-authored-by:` ท้ายข้อความ (อีเมลเดียวกับใน `team.json`)

   ```bash
   git commit -m "fix(BUG-2): DELETE ต้องเป็นเจ้าหน้าที่" -m "Co-authored-by: ชื่อเพื่อน <อีเมลของเพื่อนใน team.json>"
   ```

3. **`DEBUG_LOG.md`** — บรรทัดแรกของทุกหัวข้อ `- **ผู้รับผิดชอบ:** @github` ของเจ้าของ bug นั้น
4. **`README.md` หัวข้อ "การใช้ AI"** — เขียนแยกรายคน

> ผู้สอนดูจาก git ว่าใครเขียนส่วนไหน เพื่อ**เลือกคำถามสัมภาษณ์** — ไม่หักคะแนนจากจำนวนบรรทัด แต่**เจ้าของงานอธิบายงานของตัวเองไม่ได้ = งานนั้นของคนนั้นเหลือครึ่ง** (ไม่กระทบคะแนนส่วนตัวของเพื่อน)

## 4. FEAT — ตั้งเวลาเผยแพร่ + กรองตามหมวดหมู่ (test-first)

ฝ่ายข่าวอยากเขียนประกาศไว้ล่วงหน้า (เช่น ตารางสอบ ผลทุน) แล้วให้ขึ้นหน้าแรกเองเมื่อถึงเวลา และให้ผู้อ่านเลือกดูเฉพาะหมวดที่สนใจได้
**test สเปกให้มาแล้ว 5 ข้อ** (fail อยู่) — ทำให้ผ่าน โดย**ห้ามแก้หรือลบ test สเปก** · เพิ่ม test ของตัวเองได้และควรเพิ่ม

### 4.1 API

| endpoint | พฤติกรรมใหม่ |
|---|---|
| `GET /api/announcements` | คืนเฉพาะประกาศที่ `status = 'published'` **และ** `publishAt` ≤ เวลาปัจจุบัน · เรียงตาม `publishAt` **ใหม่ → เก่า** |
| `GET /api/announcements?category=<id>` | กรองเฉพาะหมวดหมู่นั้น (ยังซ่อนประกาศที่ยังไม่ถึงเวลา) · `<id>` ต้องเป็น**จำนวนเต็มบวก** ไม่งั้น **400** `{ error, errors: [...] }` · เป็นจำนวนเต็มบวกแต่ไม่มีหมวดนี้ → **200 `[]`** |
| `GET /api/announcements/:id` | ประกาศที่ยังไม่ถึงเวลาเผยแพร่ → **404** (เหมือนฉบับร่าง) |
| `GET /api/admin/announcements` | ทุกรายการมีฟิลด์เพิ่ม **`visibility`** ตามตารางด้านล่าง (ฟิลด์อื่นเหมือนเดิม) |

**ค่า `visibility`** — "ตอนนี้ผู้อ่านทั่วไปเห็นประกาศนี้หรือยัง"

| `status` | `publishAt` เทียบกับเวลาปัจจุบัน | `visibility` |
|---|---|---|
| `draft` | อะไรก็ได้ | `'draft'` |
| `archived` | อะไรก็ได้ | `'archived'` |
| `published` | ยังไม่ถึง (`publishAt` > ตอนนี้) | `'scheduled'` |
| `published` | ถึงแล้ว (`publishAt` ≤ ตอนนี้) | `'live'` |

> ⚠ `publishAt` มีเขตเวลา (`+07:00` หรือ `Z`) — การเทียบต้องถูกต้องข้ามเขตเวลา (เช่น `2026-10-20T05:00:00Z` คือเวลาเดียวกับ `2026-10-20T12:00:00+07:00`)

### 4.2 Frontend

- `frontend/src/utils/visibility.js` → `visibilityOf(announcement, nowMs)` คืนค่าตามตารางเดียวกัน (`announcement` มี `status` และ `publishAt` แบบที่ API ส่ง · `nowMs` = เวลาปัจจุบันเป็นมิลลิวินาที ต้องใช้ค่าที่ส่งเข้ามา ไม่ใช่นาฬิกาเครื่อง)
- หน้าแรก (รายการประกาศ): เพิ่ม **dropdown เลือกหมวดหมู่** — รายการหมวดหมู่ดึงจาก `GET /api/categories` และกรองผ่าน `?category=`
- หน้า "สำหรับเจ้าหน้าที่": แสดง **badge ของ visibility** ของแต่ละประกาศ (ฉบับร่าง · ตั้งเวลาไว้ · เผยแพร่อยู่ · เก็บเข้าคลัง)

## 5. TEST และ LOG

- **TEST:** เขียน regression test อย่างน้อย 1 ข้อต่อ bug (BUG-1, BUG-2 ใน `api/tests/` · BUG-3 ใน `frontend/src/**/*.test.js`) และ test เพิ่มของ FEAT
  ทุก test ต้องผ่านตอนส่ง · test ที่ fail หรือถูก `skip` ไม่นับ
- **LOG:** `DEBUG_LOG.md` กรอกครบทุกช่อง · ช่อง "สาเหตุ (ไฟล์:บรรทัด)" ต้องระบุตำแหน่งในโค้ด**ก่อนแก้** (เช่น `api/src/xxx.js:42`)

## 6. กติกา

1. **ห้ามเปลี่ยนชื่อหรือย้าย** สิ่งต่อไปนี้ (ระบบตรวจอัตโนมัติเรียกใช้โดยตรง)

   | ประเภท | รายการ |
   |---|---|
   | ไฟล์ + export (api) | `api/src/app.js` → `createApp` · `api/src/config.js` → `config` (รวม `config.jwtSecret`) · `api/src/services/db.js` → `loadSeed` · `api/src/routes/authRoutes.js` → `resetLoginLimiter` · `api/src/server.js` |
   | test helper | `api/tests/helpers/auth.js` → `STAFF` · `loginAsStaff(app)` · `tokenFor(role, secret)` |
   | ไฟล์ + export (frontend) | `frontend/src/utils/token.js` → `decodeTokenPayload` · `isTokenExpired` · `frontend/src/utils/permissions.js` → `canManage` · `frontend/src/utils/visibility.js` → `visibilityOf` |
   | endpoint | ทุก endpoint ในตาราง API ของ `README.md` (path · method · รูปข้อมูล) |
   | ข้อมูลตั้งต้น | แถวข้อมูลใน `api/data/schema.sql` (บัญชี · หมวดหมู่ · ประกาศ ANN-001 ถึง ANN-010) — ห้ามแก้หรือลบ |

2. **ห้ามแก้หรือลบ test เดิม** (รวม test สเปกของ FEAT) — เพิ่มได้อย่างเดียว · ผู้สอนจะเพิ่ม hidden test ตอนตรวจ
3. ใช้ dependency ตามที่ให้มา ไม่ต้องติดตั้ง package เพิ่ม
4. **commit แยกเป็นเรื่อง โดยเจ้าของงาน** อย่างน้อย 1 commit ต่องาน (เช่น `fix(BUG-1): ...` · `feat: ...` · `test: ...`) · navigator ใส่ `Co-authored-by:` (หัวข้อ 3.1) — history ใช้ประกอบการสัมภาษณ์
5. **การใช้ AI:** ใช้ได้ แต่ต้องเปิดเผยใน `README.md` หัวข้อ **"การใช้ AI"** แยกรายคน (ใช้อะไร ทำข้อไหน ตรวจ/แก้อะไรเอง) · **อธิบายโค้ดที่ส่งไม่ได้ในการสัมภาษณ์ = ไม่ได้คะแนนข้อนั้น**
6. ทำในทีมของตัวเองเท่านั้น · **ห้ามแชร์โค้ดหรือ repo กับทีมอื่น** (ผู้สอนตรวจความคล้ายของโค้ดข้ามทีม) · repo ต้องเป็น **private**

## 7. การส่ง

1. คนหนึ่งในทีมกด **Use this template → Create a new repository** บน GitHub · ตั้งเป็น **Private** · ชื่อแนะนำ `engse203-takehome-b-<ชื่อทีม>` (**1 ทีม = 1 repo**)
2. **Settings → Collaborators → Add people** เพิ่มเพื่อนในทีมทุกคน และบัญชี GitHub ของผู้สอนตามที่ประกาศในกลุ่มรายวิชา
3. เมื่อทำเสร็จ ติด tag แล้ว push:

   ```bash
   git tag takehome-B-v1
   git push origin main --tags
   ```

4. ส่งลิงก์ repo ตามช่องทางที่ผู้สอนประกาศ — **ทีมละ 1 ครั้ง** (ระบุชื่อทีมและหัวข้อ Term Project)

> ตรวจจาก commit ที่ tag **`takehome-B-v1`** ชี้อยู่ · tag ต้องถูก push **ก่อนเวลาเริ่มสอบของ Section 2 วันพฤหัสบดี 22 ต.ค. 2569** · push หลังเวลา / ไม่มี tag = ไม่ตรวจ
> ถ้าต้องแก้หลังติด tag (ก่อนหมดเวลา): `git tag -f takehome-B-v1 && git push -f origin takehome-B-v1`

**ตรวจก่อนส่ง**

- [ ] `npm test --prefix api` และ `npm test --prefix frontend` ผ่านทั้งหมด
- [ ] `npm run build --prefix frontend` ผ่าน
- [ ] `git ls-files` ไม่มี `.env` · `*.db` · `node_modules` · `dist`
- [ ] `DEBUG_LOG.md` ครบทุกช่อง และมี "ผู้รับผิดชอบ" ทุกหัวข้อ · README หัวข้อ "การใช้ AI" กรอก**ทุกคน**
- [ ] `team.json` ครบทุกคน · `email` ตรงกับ `git config user.email` · งานแต่ละชิ้น commit โดยเจ้าของ
- [ ] ทีม 3 คน: CI ที่ `.github/workflows/` ผ่าน และ README มีวิธีรันแบบ production (OPS)
- [ ] tag `takehome-B-v1` อยู่บน GitHub แล้ว (ดูที่หน้า repo → Tags)

## 8. การสัมภาษณ์วันสอบ

การสัมภาษณ์วันสอบ (ร่วมกับ Term Project · ทีมละ 15 นาที) **ถามและให้คะแนนรายคนตามบทบาท** — แต่ละคนถูกถามงานที่ตัวเองเป็นเจ้าของ และ 1 ข้อเรื่องงานของเพื่อนที่ตัวเองเป็น navigator · คนที่ถูกถามตอบเอง เพื่อนห้ามช่วย · เตรียมเปิด repo ของทีมบนเครื่องให้พร้อม

| บทบาท | เตรียมตอบ |
|---|---|
| Front-end | BUG-3: ทำซ้ำอาการบนโค้ดก่อนแก้ด้วย DevTools · ชี้ไฟล์:บรรทัด · FEAT ส่วนหน้าเว็บ: ตรวจข้อมูลที่หน้าเว็บแล้ว ทำไม API ยังต้องตรวจซ้ำ · test ฝั่ง frontend ที่เขียนกันอะไร |
| Back-end (ทีมคู่: Back-end + DevOps) | BUG-1 · BUG-2: ทำซ้ำด้วย curl หรือ integration test · ทำไมแก้ตรงนั้น · FEAT ส่วน API: ทำไมกรองที่ SQL/ชั้น service ไม่ใช่ที่หน้าเว็บ · ถ้าย้อนการแก้ test ข้อไหน fail · (ทีมคู่) ตอบเรื่อง SEC ด้วย |
| DevOps (ทีม 3 คน) | SEC: ลบค่าออกจากไฟล์แล้วทำไมยังไม่พอ · fail fast ทำงานอย่างไร · CI ของทีมรันอะไร ถ้า test ไม่ผ่านจะเห็นที่ไหน · production ตั้ง `JWT_SECRET` ที่ไหน |
| ทุกคน | งานของเพื่อนที่คุณเป็น navigator — เล่าได้ระดับ "แก้อะไร · ทำไม · test ไหนกัน" |

**test ผ่านแต่เจ้าของงานอธิบายไม่ได้ = งานนั้นของคนนั้นเหลือครึ่ง**
