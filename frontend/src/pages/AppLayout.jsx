import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';

function AppLayout() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="container page-content" id="main-content">
        <Outlet />
      </main>
      <footer className="site-footer"><div className="container">ENGSE203 · ข้อมูลสาธิต ไม่ใช่ประกาศจริงของคณะ</div></footer>
    </div>
  );
}

export default AppLayout;
