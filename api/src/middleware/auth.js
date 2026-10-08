import jwt from 'jsonwebtoken';

/**
 * ป้องกัน route ด้วย JWT
 *
 *   authenticate      → "คุณคือใคร"          ไม่มี token / token ใช้ไม่ได้  → 401
 *   requireRole(role) → "คุณทำสิ่งนี้ได้ไหม"   รู้ว่าเป็นใคร แต่ไม่มีสิทธิ์     → 403
 *
 *   router.post('/', authenticate, requireRole('staff'), ..., controller.create)
 */
export function authenticate(req, res, next) {
  const header = req.get('Authorization') ?? '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    res.set('WWW-Authenticate', 'Bearer');
    return res.status(401).json({ error: 'ต้องเข้าสู่ระบบก่อน' });
  }
  const payload = jwt.decode(token);
  if (!payload) {
    res.set('WWW-Authenticate', 'Bearer error="invalid_token"');
    return res.status(401).json({ error: 'token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่' });
  }
  req.user = payload;   // แนบข้อมูลผู้ใช้ไว้ให้ middleware/controller ถัดไป
  next();
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: 'ไม่มีสิทธิ์ทำรายการนี้' });
    }
    next();
  };
}
