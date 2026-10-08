import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { logout } from '../services/authService.js';

const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

function AppHeader() {
  const { user } = useAuth();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <p className="eyebrow">ENGSE203 • FACULTY NEWS</p>
          <p className="brand">ประกาศข่าวคณะ</p>
        </div>
        <nav aria-label="เมนูหลัก">
          <NavLink className={navClass} end to="/">ประกาศ</NavLink>
          <NavLink className={navClass} end to="/staff">สำหรับเจ้าหน้าที่</NavLink>
          {user ? (
            <button className="nav-link as-button" type="button" onClick={logout} data-testid="logout-button">
              ออกจากระบบ ({user.name})
            </button>
          ) : (
            <NavLink className={navClass} to="/login">เข้าสู่ระบบ</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
