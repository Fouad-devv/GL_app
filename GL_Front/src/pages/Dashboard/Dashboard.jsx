import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Alert } from '../../components/Alert';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import useDashboardAPI from '../../api/dashboardAPI.js';
import { DashboardHeader } from './components/DashboardHeader';
import { KpiGrid } from './components/KpiGrid';
import { AlertsSection } from './components/AlertsSection';
import { UpcomingInterventionsTable } from './components/UpcomingInterventionsTable';
import { InterventionStats } from './components/InterventionStats';

export const Dashboard = () => {
  const { keycloak } = useKeycloak();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [upcomingInterventions, setUpcomingInterventions] = useState([]);
  const dashboardAPI = useDashboardAPI();

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const kpiRes      = await dashboardAPI.getKPIs();
      const statsRes    = await dashboardAPI.getInterventionStats();
      const alertRes    = await dashboardAPI.getAlerts();
      const upcomingRes = await dashboardAPI.getUpcomingInterventions(7);
      setKpis(kpiRes.data);
      setStats(statsRes.data);
      setAlerts(alertRes.data || []);
      setUpcomingInterventions(upcomingRes.data || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingOverlay visible={true} />;

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0">
      <DashboardHeader username={keycloak?.tokenParsed?.preferred_username} />
      {error && <Alert type="error" message={error} closeable={false} />}
      <KpiGrid kpis={kpis} />
      <AlertsSection alerts={alerts} />
      <UpcomingInterventionsTable interventions={upcomingInterventions} />
      <InterventionStats stats={stats} />
    </div>
  );
};
