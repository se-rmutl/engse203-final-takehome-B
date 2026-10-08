import { Route, Routes } from 'react-router-dom';
import AppLayout from './pages/AppLayout.jsx';
import AnnouncementListPage from './pages/AnnouncementListPage.jsx';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import StaffDashboardPage from './pages/StaffDashboardPage.jsx';
import AnnouncementFormPage from './pages/AnnouncementFormPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<AnnouncementListPage />} />
        <Route path="announcements/:id" element={<AnnouncementDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="staff" element={<StaffDashboardPage />} />
        <Route path="staff/new" element={<AnnouncementFormPage />} />
        <Route path="staff/:id/edit" element={<AnnouncementFormPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
