import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AnnouncementForm from '../components/AnnouncementForm.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { createAnnouncement, getAdminAnnouncementById, updateAnnouncement } from '../services/announcementService.js';

/** สร้างประกาศใหม่ (/staff/new) และแก้ไข (/staff/:id/edit) ใช้ฟอร์มเดียวกัน */
function AnnouncementFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loadState, setLoadState] = useState(isEdit ? 'loading' : 'success');
  const [initial, setInitial] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isEdit) return undefined;
    let ignore = false;
    getAdminAnnouncementById(id).then((found) => {
      if (ignore) return;
      setInitial(found);
      setLoadState(found ? 'success' : 'missing');
    }).catch((error) => {
      if (ignore) return;
      setErrorMessage(error instanceof Error ? error.message : 'โหลดประกาศไม่สำเร็จ');
      setLoadState('error');
    });
    return () => { ignore = true; };
  }, [id, isEdit]);

  async function handleSubmit(input) {
    if (isEdit) await updateAnnouncement(id, input);
    else await createAnnouncement(input);
    navigate('/staff');
  }

  return (
    <section data-testid="page-announcement-form">
      <div className="page-heading"><div><p className="eyebrow dark">STAFF</p><h1>{isEdit ? `แก้ไขประกาศ ${id}` : 'สร้างประกาศใหม่'}</h1></div></div>
      {loadState === 'loading' && <LoadingState />}
      {loadState === 'error' && <ErrorState message={errorMessage} />}
      {loadState === 'missing' && <section className="state-card"><h2>ไม่พบประกาศ</h2><Link to="/staff">กลับหน้าจัดการประกาศ</Link></section>}
      {loadState === 'success' && (
        <section className="panel form-panel">
          <AnnouncementForm initialValue={initial} onSubmit={handleSubmit} submitLabel={isEdit ? 'บันทึกการแก้ไข' : 'สร้างประกาศ'} />
        </section>
      )}
    </section>
  );
}

export default AnnouncementFormPage;
