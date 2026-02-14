import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-prodex-bg">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-16 p-6">
        <Outlet />
      </main>
    </div>
  );
}
