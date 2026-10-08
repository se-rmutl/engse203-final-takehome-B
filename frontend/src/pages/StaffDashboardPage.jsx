import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useAuth from '../hooks/useAuth.js';
import { ApiError, deleteAnnouncement, getAdminAnnouncements } from '../services/announcementService.js';
import { formatDateTime } from '../utils/datetime.js';

const STATUS_LABELS = { draft: 'ฉบับร่าง', published: 'เผยแพร่', archived: 'เก็บเข้าคลัง' };

/** หน้าเจ้าหน้าที่ — ประกาศทุกสถานะ (ข้อมูลจาก GET /api/admin/announcements) */
function StaffDashboardPage() {
  const { isStaff } = useAuth();
  const [loadState, setLoadState] = useState('loading');
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let ignore = false;
    setLoadState('loading');
    getAdminAnnouncements().then((data) => {
      if (ignore) return;
      setItems(data);
      setLoadState('success');
    }).catch((err) => {
      if (ignore) return;
      setError(err);
      setLoadState('error');
    });
    return () => { ignore = true; };
  }, [reloadKey]);

  async function handleDelete(item) {
    if (!window.confirm(`ต้องการลบประกาศ "${item.title}" หรือไม่?`)) return;
    try {
      await deleteAnnouncement(item.id);
      setNotice(`ลบประกาศ ${item.id} แล้ว`);
      reload();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'ลบประกาศไม่สำเร็จ');
    }
  }

  const needLogin = error instanceof ApiError && error.status === 401;

  return (
    <section data-testid="page-staff">
      <div className="page-heading">
        <div><p className="eyebrow dark">STAFF DASHBOARD</p><h1>จัดการประกาศ</h1><p>ประกาศทุกสถานะ รวมฉบับร่างและที่เก็บเข้าคลัง</p></div>
        {isStaff && <Link className="button primary inline" to="/staff/new">+ สร้างประกาศ</Link>}
      </div>
      {notice && <p className="notice" role="status">{notice}</p>}
      {loadState === 'loading' && <LoadingState />}
      {loadState === 'error' && (
        <ErrorState message={error?.message} onRetry={needLogin ? undefined : reload}>
          {needLogin && <Link className="button primary inline" to="/login">เข้าสู่ระบบเจ้าหน้าที่</Link>}
        </ErrorState>
      )}
      {loadState === 'success' && (
        <div className="panel table-wrap">
          <table className="staff-table">
            <thead>
              <tr><th>รหัส</th><th>หัวข้อ</th><th>หมวด</th><th>สถานะ</th><th>เผยแพร่</th><th>ผู้ประกาศ</th>{isStaff && <th>จัดการ</th>}</tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.title}</td>
                  <td>{a.categoryName}</td>
                  <td><span className={`badge ${a.status}`}>{STATUS_LABELS[a.status] ?? a.status}</span></td>
                  <td>{formatDateTime(a.publishAt)}</td>
                  <td>{a.authorName}</td>
                  {isStaff && (
                    <td className="actions">
                      <Link className="button secondary inline" to={`/staff/${a.id}/edit`}>แก้ไข</Link>
                      <button className="button danger" type="button" onClick={() => handleDelete(a)}>ลบ</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default StaffDashboardPage;
