import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminKegiatanEdit from './pages/AdminKegiatanEdit.jsx';
import AdminLayananEdit from './pages/AdminLayananEdit.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Beranda from './pages/Beranda.jsx';
import Kegiatan from './pages/Kegiatan.jsx';
import KegiatanDetail from './pages/KegiatanDetail.jsx';
import Kontak from './pages/Kontak.jsx';
import Layanan from './pages/Layanan.jsx';
import Profil from './pages/Profil.jsx';
import { getAdminToken } from './lib/supabase.js';

function ProtectedRoute({ children }) {
  return getAdminToken() ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/kegiatan" element={<Kegiatan />} />
        <Route path="/kegiatan/:id" element={<KegiatanDetail />} />
        <Route path="/layanan" element={<Layanan />} />
        <Route path="/kontak" element={<Kontak />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kegiatan/:id/edit"
        element={
          <ProtectedRoute>
            <AdminKegiatanEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/layanan/:id/edit"
        element={
          <ProtectedRoute>
            <AdminLayananEdit />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
