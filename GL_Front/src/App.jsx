import { Routes, Route, Outlet } from 'react-router-dom';
import { useState } from 'react';

import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRouteProtector } from './components/AdminProtecte';
import { Layout } from './components/Layout';

// pages
import { Public } from './pages/public/public';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { AddUser } from './pages/user/Adduser';
import { Maintenance } from './pages/maintenance/maintenance';
import { MaintenancePointDetail } from './pages/maintenance/components/MaintenancePointDetail';
import { Users } from './pages/user/Users';
import { Machines } from './pages/machines/machines';
import { MachineDetail } from './pages/machines/components/MachineDetail';
import { Interventions } from './pages/interventions/interventions';
import { InterventionDetail } from './pages/interventions/components/InterventionDetail';
import { Planning } from './pages/planning/planning';
import { Reports } from './pages/reports/reports';

function App() {
  const [isOpen, setIsOpen]           = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const closeSidebar = () => { setIsOpen(false); setOpenProfile(false); };

  const layoutProps = { isOpen, setIsOpen, openProfile, setOpenProfile, closeSidebar };

  return (
    <Routes>
      <Route path="/" element={<Public />} />

      {/* Single persistent Layout — Sidebar never remounts on navigation */}
      <Route element={<Layout {...layoutProps}><Outlet /></Layout>}>
        <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/machines"       element={<ProtectedRoute><Machines /></ProtectedRoute>} />
        <Route path="/machines/:id"   element={<ProtectedRoute><MachineDetail /></ProtectedRoute>} />
        <Route path="/maintenance"      element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
        <Route path="/maintenance/:id"  element={<ProtectedRoute><MaintenancePointDetail /></ProtectedRoute>} />
        <Route path="/interventions"      element={<ProtectedRoute><Interventions /></ProtectedRoute>} />
        <Route path="/interventions/:id"  element={<ProtectedRoute><InterventionDetail /></ProtectedRoute>} />
        <Route path="/planning"      element={<ProtectedRoute><Planning /></ProtectedRoute>} />
        <Route path="/reports"       element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/users"         element={<AdminRouteProtector><Users /></AdminRouteProtector>} />
        <Route path="/users/add-user" element={<AdminRouteProtector><AddUser /></AdminRouteProtector>} />
      </Route>
    </Routes>
  );
}

export default App;
