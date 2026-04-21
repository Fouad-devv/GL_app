import { FiRefreshCw, FiCalendar } from 'react-icons/fi';

const frDate = () =>
  new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

export const DashboardHeader = ({ username, onRefresh }) => (
  <div className="mb-8 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 55%, #0ea5e9 100%)' }}>
    <div className="px-7 py-6 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FiCalendar className="text-blue-200 text-sm" />
          <span className="text-blue-200 text-xs font-medium capitalize">{frDate()}</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Tableau de Bord</h1>
        <p className="text-blue-200 text-sm mt-1">
          Bienvenue,&nbsp;<span className="text-white font-semibold">{username ?? '—'}</span>
        </p>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: 'rgba(255,255,255,0.18)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
        >
          <FiRefreshCw className="text-base" />
          Actualiser
        </button>
      )}
    </div>
    <div className="h-1" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,.25),transparent)' }} />
  </div>
);
