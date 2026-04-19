import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle, FiActivity, FiDollarSign } from 'react-icons/fi';
import { StatsCard } from '../../../components/Card';

export const KpiGrid = ({ kpis }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatsCard title="Taux de réalisation" value={kpis?.implementationRate ? `${Math.round(kpis.implementationRate)}%` : 'N/A'} icon={FiTrendingUp} color="blue" />
      <StatsCard title="Pannes évitées" value={kpis?.preventedFailures || 0} icon={FiCheckCircle} color="green" />
      <StatsCard title="Temps moyen (minutes)" value={kpis?.avgInterventionTime || 0} icon={FiClock} color="purple" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatsCard title="Interventions en retard" value={kpis?.delayedInterventions || 0} icon={FiAlertCircle} color="red" />
      <StatsCard title="Disponibilité machines" value={kpis?.machineAvailability ? `${Math.round(kpis.machineAvailability)}%` : 'N/A'} icon={FiActivity} color="yellow" />
      <StatsCard title="Coûts mensuels" value={kpis?.monthlyCost != null ? `${kpis.monthlyCost.toLocaleString('fr-MA')} MAD` : '0 MAD'} icon={FiDollarSign} color="green" />
    </div>
  </>
);
