import { FiCalendar, FiClock, FiTool, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/dateUtils';

const STATUS_STYLE = {
  PLANIFIEE: { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6', label: 'Planifiée'  },
  EN_COURS:  { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b', label: 'En cours'   },
  EN_RETARD: { bg: '#fef2f2', color: '#b91c1c', dot: '#ef4444', label: 'En retard'  },
  TERMINEE:  { bg: '#ecfdf5', color: '#065f46', dot: '#10b981', label: 'Terminée'   },
  ANNULEE:   { bg: '#f9fafb', color: '#6b7280', dot: '#9ca3af', label: 'Annulée'    },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.ANNULEE;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
};

export const UpcomingInterventionsTable = ({ interventions }) => {
  const navigate = useNavigate();
  return (
    <div
    className="bg-white rounded-2xl p-6 mb-6"
    style={{
      border: '1px solid rgba(0,0,0,0.06)',
      borderTop: '3px solid #f97316',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}
  >
    <div className="flex items-center justify-between mb-5">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <FiCalendar size={13} style={{ color: '#f97316' }} />
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Interventions à venir
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">Dans les 7 prochains jours</p>
      </div>
      <span
        className="text-xs font-semibold px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(249,115,22,0.08)', color: '#ea580c', border: '1px solid rgba(249,115,22,0.2)' }}
      >
        {interventions.length} prévu{interventions.length !== 1 ? 's' : ''}
      </span>
    </div>

    {interventions.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
          style={{ background: 'rgba(249,115,22,0.06)' }}
        >
          <FiCalendar size={20} style={{ color: '#f97316' }} />
        </div>
        <p className="text-sm font-medium text-gray-500">Aucune intervention planifiée</p>
        <p className="text-xs text-gray-400 mt-0.5">Les 7 prochains jours sont libres</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {['Machine', 'Point de maintenance', 'Date', 'Heure', 'Statut', ''].map(h => (
                <th
                  key={h}
                  className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interventions.map((iv, idx) => {
              const s = STATUS_STYLE[iv.status] ?? STATUS_STYLE.ANNULEE;
              return (
                <tr
                  key={idx}
                  className="transition-colors cursor-pointer"
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}
                  onClick={() => navigate(`/interventions/${iv.id}`)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="px-3 py-3.5" style={{ borderLeft: `3px solid ${s.dot}` }}>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(249,115,22,0.08)' }}
                      >
                        <FiTool size={12} style={{ color: '#f97316' }} />
                      </div>
                      <span className="font-medium text-gray-900">{iv.machineName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-gray-500 text-sm">
                    {iv.maintenancePointName ?? '—'}
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                      <FiCalendar size={11} className="flex-shrink-0 text-gray-400" />
                      {formatDate(iv.plannedDate)}
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    {iv.plannedTime ? (
                      <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                        <FiClock size={11} className="flex-shrink-0 text-gray-400" />
                        {iv.plannedTime}
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={iv.status} />
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <FiArrowRight size={14} style={{ color: '#d1d5db', display: 'inline-block', transition: 'color 0.2s, transform 0.2s' }}
                      className="group-hover:text-orange-400" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
    </div>
  );
};
