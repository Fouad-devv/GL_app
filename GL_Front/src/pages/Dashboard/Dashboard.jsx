import { useState, useEffect, useCallback } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Alert } from '../../components/Alert';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import useDashboardAPI from '../../api/dashboardAPI.js';
import { DashboardHeader }            from './components/DashboardHeader';
import { KpiGrid }                    from './components/KpiGrid';
import { AlertsSection }              from './components/AlertsSection';
import { InterventionStatusChart }    from './components/InterventionStatusChart';
import { MachineStatusChart }         from './components/MachineStatusChart';
import { PerformanceGauges }          from './components/PerformanceGauges';
import { InterventionStats }          from './components/InterventionStats';
import { UpcomingInterventionsTable } from './components/UpcomingInterventionsTable';

const settle = r => r.status === 'fulfilled' ? r.value.data : null;

const reveal = (delay = 0) => ({
  animation: `dash-up 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
});

export const Dashboard = () => {
  useDocumentTitle('Tableau de Bord');
  const { keycloak } = useKeycloak();
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [kpis, setKpis]         = useState(null);
  const [stats, setStats]       = useState(null);
  const [alerts, setAlerts]     = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [machines, setMachines] = useState(null);
  const api = useDashboardAPI();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [kpiR, statsR, alertR, upR, opR, maintR, repR, oosR] =
        await Promise.allSettled([
          api.getKPIs(),
          api.getInterventionStats(),
          api.getAlerts(),
          api.getUpcomingInterventions(7),
          api.getMachineOperational(),
          api.getMachineMaintenance(),
          api.getMachineRepair(),
          api.getMachineOutOfService(),
        ]);

      if (settle(kpiR))   setKpis(settle(kpiR));
      if (settle(statsR)) setStats(settle(statsR));
      setAlerts(settle(alertR) ?? []);
      setUpcoming(settle(upR) ?? []);
      setMachines({
        operational:  settle(opR)    ?? 0,
        maintenance:  settle(maintR) ?? 0,
        repair:       settle(repR)   ?? 0,
        outOfService: settle(oosR)   ?? 0,
      });
    } catch (e) {
      console.error(e);
      setError('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingOverlay visible={true} />;

  const raw      = keycloak?.tokenParsed?.preferred_username || '';
  const username = raw.includes('@') ? raw.split('@')[0] : raw;

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0 max-w-[1600px] mx-auto space-y-6">

      {/* Header */}
      <div style={reveal(0)}>
        <DashboardHeader
          username={username}
          onRefresh={load}
        />
        {error && <Alert type="error" message={error} closeable={false} />}
      </div>

      {/* KPI row — 4 cards across */}
      <div style={reveal(60)}>
        <KpiGrid kpis={kpis} />
      </div>

      {/* Charts + Gauges — 3 equal columns */}
      <div
        style={reveal(120)}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        <MachineStatusChart machines={machines} />
        <InterventionStatusChart stats={stats} />
        <PerformanceGauges kpis={kpis} stats={stats} />
      </div>

      {/* Summary stats — 3 cards */}
      <div style={reveal(180)}>
        <InterventionStats stats={stats} />
      </div>

      {/* Alerts */}
      <div style={reveal(210)}>
        <AlertsSection alerts={alerts} />
      </div>

      {/* Upcoming interventions table */}
      <div style={reveal(240)}>
        <UpcomingInterventionsTable interventions={upcoming} />
      </div>

    </div>
  );
};
