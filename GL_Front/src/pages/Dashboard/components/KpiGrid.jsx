import {
  FiTrendingUp, FiCheckCircle, FiClock,
  FiAlertTriangle, FiActivity, FiDollarSign,
} from 'react-icons/fi';

const CARDS = [
  {
    key: 'implementationRate',
    title: 'Taux de réalisation',
    fmt: v => v != null ? `${Math.round(v)}%` : '—',
    icon: FiTrendingUp,
    theme: { border: '#3b82f6', icon: '#3b82f6', bg: '#eff6ff', val: '#1d4ed8' },
  },
  {
    key: 'completedInterventions',
    title: 'Interventions terminées',
    fmt: v => v ?? 0,
    icon: FiCheckCircle,
    theme: { border: '#10b981', icon: '#10b981', bg: '#ecfdf5', val: '#065f46' },
  },
  {
    key: 'avgInterventionTime',
    title: 'Durée moyenne (min)',
    fmt: v => v ?? 0,
    icon: FiClock,
    theme: { border: '#8b5cf6', icon: '#8b5cf6', bg: '#f5f3ff', val: '#4c1d95' },
  },
  {
    key: 'delayedInterventions',
    title: 'Interventions en retard',
    fmt: v => v ?? 0,
    icon: FiAlertTriangle,
    theme: { border: '#ef4444', icon: '#ef4444', bg: '#fef2f2', val: '#991b1b' },
  },
  {
    key: 'machineAvailability',
    title: 'Disponibilité machines',
    fmt: v => v != null ? `${Math.round(v)}%` : '—',
    icon: FiActivity,
    theme: { border: '#f59e0b', icon: '#f59e0b', bg: '#fffbeb', val: '#92400e' },
  },
  {
    key: 'monthlyCost',
    title: 'Coûts du mois',
    fmt: v => v != null ? `${Number(v).toLocaleString('fr-MA')} MAD` : '0 MAD',
    icon: FiDollarSign,
    theme: { border: '#06b6d4', icon: '#06b6d4', bg: '#ecfeff', val: '#164e63' },
  },
];

const KpiCard = ({ card, kpis }) => {
  const { title, fmt, icon: Icon, theme } = card;
  const value = fmt(kpis?.[card.key]);
  return (
    <div
      className="bg-white rounded-2xl p-5 hover:shadow-md transition-shadow duration-200"
      style={{ border: `1px solid ${theme.border}22`, borderLeft: `4px solid ${theme.border}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider leading-4">{title}</p>
          <p className="text-3xl font-bold mt-2 leading-none truncate" style={{ color: theme.val }}>
            {value}
          </p>
        </div>
        <div className="rounded-xl p-2.5 flex-shrink-0" style={{ background: theme.bg }}>
          <Icon style={{ color: theme.icon, fontSize: 20 }} />
        </div>
      </div>
    </div>
  );
};

export const KpiGrid = ({ kpis }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
    {CARDS.map(card => <KpiCard key={card.key} card={card} kpis={kpis} />)}
  </div>
);
