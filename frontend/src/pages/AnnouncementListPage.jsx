import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { getAnnouncements } from '../services/announcementService.js';
import { formatDateTime } from '../utils/datetime.js';

/** หน้าแรก — ประกาศที่เผยแพร่แล้ว (ใครก็ดูได้ ไม่ต้องเข้าสู่ระบบ) */
function AnnouncementListPage() {
  const [loadState, setLoadState] = useState('loading');
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoadState('loading');
    getAnnouncements().then((data) => {
      if (ignore) return;
      setItems(data);
      setLoadState('success');
    }).catch((error) => {
      if (ignore) return;
      setErrorMessage(error instanceof Error ? error.message : 'โหลดประกาศไม่สำเร็จ');
      setLoadState('error');
    });
    return () => { ignore = true; };
  }, [reloadKey]);

  return (
    <section data-testid="page-announcements">
      <div className="page-heading">
        <div><p className="eyebrow dark">ANNOUNCEMENTS</p><h1>ประกาศล่าสุด</h1><p>ข่าวและประกาศจากคณะวิศวกรรมศาสตร์</p></div>
      </div>
      {loadState === 'loading' && <LoadingState />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={() => setReloadKey((k) => k + 1)} />}
      {loadState === 'success' && items.length === 0 && <p className="subtle-empty">ยังไม่มีประกาศ</p>}
      {loadState === 'success' && items.length > 0 && (
        <div className="news-list">
          {items.map((a) => (
            <article className="news-card" key={a.id}>
              <p className="meta"><span className="badge category">{a.categoryName}</span> · {formatDateTime(a.publishAt)}</p>
              <h2><Link to={`/announcements/${a.id}`}>{a.title}</Link></h2>
              <p className="excerpt">{a.body}</p>
              <p className="meta">โดย {a.authorName}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AnnouncementListPage;
