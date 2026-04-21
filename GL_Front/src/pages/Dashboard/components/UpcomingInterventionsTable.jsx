import { FiCalendar, FiClock, FiTool } from 'react-icons/fi';
import { formatDate } from '../../../utils/dateUtils';

const STATUS_STYLE = {
  PLANIFIEE: { bg: '#eff6ff', color: '#1d4ed8', label: 'Planifiée'  },
  EN_COURS:  { bg: '#fffbeb', color: '#b45309', label: 'En cours'   },
  EN_RETARD: { bg: '#fef2f2', color: '#b91c1c', label: 'En retard'  },
  TERMINEE:  { bg: '#ecfdf5', color: '#065f46', label: 'Terminée'   },
  ANNULEE:   { bg: '#f9fafb', color: '#6b7280', label: 'Annulée'    },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.ANNULEE;
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
};

export const UpcomingInterventionsTable = ({ interventions }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
    <div className="flex items-center justify-between mb-5">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Interventions à venir</p>
        <p className="text-sm text-gray-500 mt-0.5">Dans les 7 prochains jours</p>
      </div>
      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
        {interventions.length} prévu{interventions.length !== 1 ? 's' : ''}
      </span>
    </div>

    {interventions.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <FiCalendar className="text-3xl mb-2" />
        <p className="text-sm">Aucune intervention planifiée</p>
      </div>
    ) : (
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {['Machine', 'Point de maintenance', 'Date', 'Heure', 'Statut'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2.5 border-b border-gray-100">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interventions.map((iv, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FiTool className="text-blue-500 text-xs" />
                    </div>
                    <span className="font-medium text-gray-900">{iv.machineName}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-gray-500">{iv.maintenancePointName ?? '—'}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <FiCalendar className="text-xs flex-shrink-0" />
                    {formatDate(iv.plannedDate)}
                  </div>
                </td>
                <td className="px-3 py-3">
                  {iv.plannedTime ? (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <FiClock className="text-xs flex-shrink-0" />
                      {iv.plannedTime}
                    </div>
                  ) : '—'}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={iv.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
