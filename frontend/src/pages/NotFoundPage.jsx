import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="state-card">
      <p className="eyebrow dark">404</p><h1>ไม่พบหน้าที่ต้องการ</h1><Link className="button primary inline" to="/">กลับหน้าประกาศ</Link>
    </section>
  );
}

export default NotFoundPage;
