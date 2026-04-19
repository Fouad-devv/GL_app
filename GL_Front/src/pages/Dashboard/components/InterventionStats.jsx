import { Card } from '../../../components/Card';

const STATUS_ROWS = [
  { key: 'PLANIFIEE', label: 'Planifiée',  bg: 'bg-blue-500',   light: 'bg-blue-100',   text: 'text-blue-700'   },
  { key: 'EN_COURS',  label: 'En cours',   bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-700' },
  { key: 'TERMINEE',  label: 'Terminée',   bg: 'bg-green-500',  light: 'bg-green-100',  text: 'text-green-700'  },
  { key: 'ANNULEE',   label: 'Annulée',    bg: 'bg-gray-400',   light: 'bg-gray-100',   text: 'text-gray-600'   },
  { key: 'EN_RETARD', label: 'En retard',  bg: 'bg-red-500',    light: 'bg-red-100',    text: 'text-red-700'    },
];

export const InterventionStats = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Interventions par statut">
        <div className="space-y-4">
          {STATUS_ROWS.map(({ key, label, bg, light, text }) => {
            const count = stats.byStatus?.[key] ?? 0;
            const total = stats.totalInterventions || 1;
            const pct   = Math.round((count / total) * 100);
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${text}`}>{label}</span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
                <div className={`w-full h-2 rounded-full ${light}`}>
                  <div className={`h-2 rounded-full ${bg} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Statistiques générales">
        <div className="space-y-4">
          {[
            { label: 'Total interventions', value: stats.totalInterventions || 0 },
            { label: 'Machines en service',  value: stats.activeMachines    || 0 },
            { label: 'Techniciens',          value: stats.technicians       || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{label}</span>
              <span className="font-bold text-gray-900 text-lg">{value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
