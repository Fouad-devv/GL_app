import { useState, useEffect, useCallback } from 'react';
import { useKeycloak } from '@react-keycloak/web';
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

export const Dashboard = () => {
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
        operational:  settle(opR)   ?? 0,
        maintenance:  settle(maintR) ?? 0,
        repair:       settle(repR)  ?? 0,
        outOfService: settle(oosR)  ?? 0,
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

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0 max-w-[1600px] mx-auto">
      <DashboardHeader
        username={keycloak?.tokenParsed?.preferred_username}
        onRefresh={load}
      />

      {error && <Alert type="error" message={error} closeable={false} />}

      {/* KPI + Performance row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2">
          <KpiGrid kpis={kpis} />
        </div>
        <PerformanceGauges kpis={kpis} stats={stats} />
      </div>

      {/* Alerts */}
      <AlertsSection alerts={alerts} />

      {/* 2-column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <MachineStatusChart machines={machines} />
        <InterventionStatusChart stats={stats} />
      </div>

      {/* Summary stats */}
      <InterventionStats stats={stats} />

      {/* Upcoming table */}
      <UpcomingInterventionsTable interventions={upcoming} />
    </div>
  );
};
