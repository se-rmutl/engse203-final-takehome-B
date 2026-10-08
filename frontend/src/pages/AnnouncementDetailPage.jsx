import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { getAnnouncementById } from '../services/announcementService.js';
import { formatDateTime } from '../utils/datetime.js';

function AnnouncementDetailPage() {
  const { id } = useParams();
  const [loadState, setLoadState] = useState('loading');
  const [item, setItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoadState('loading');
    getAnnouncementById(id).then((result) => {
      if (ignore) return;
      setItem(result);
      setLoadState('success');
    }).catch((error) => {
      if (ignore) return;
      setErrorMessage(error instanceof Error ? error.message : 'โหลดประกาศไม่สำเร็จ');
      setLoadState('error');
    });
    return () => { ignore = true; };
  }, [id]);

  return (
    <section data-testid="page-announcement-detail">
      {loadState === 'loading' && <LoadingState message="กำลังโหลดประกาศ…" />}
      {loadState === 'error' && <ErrorState message={errorMessage} />}
      {loadState === 'success' && !item && (
        <section className="state-card"><h2>ไม่พบประกาศ</h2><p>ไม่พบประกาศรหัส <code>{id}</code> หรือยังไม่เผยแพร่</p><Link to="/">กลับหน้าประกาศ</Link></section>
      )}
      {loadState === 'success' && item && (
        <article className="panel detail-card">
          <p className="meta"><span className="badge category">{item.categoryName}</span> · {formatDateTime(item.publishAt)} · {item.id}</p>
          <h1>{item.title}</h1>
          <p className="detail-body">{item.body}</p>
          <p className="meta">ประกาศโดย {item.authorName}</p>
          <Link to="/">← กลับหน้าประกาศ</Link>
        </article>
      )}
    </section>
  );
}

export default AnnouncementDetailPage;
