import { FiRefreshCw, FiCalendar } from 'react-icons/fi';

const frDate = () =>
  new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

export const DashboardHeader = ({ username, onRefresh }) => (
  <div className="mb-8 rounded-2xl overflow-hidden" style={{
    background: 'linear-gradient(135deg, #1a0c02 0%, #0e0800 55%, #130900 100%)',
    border: '1px solid rgba(249,115,22,0.12)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(249,115,22,0.06)',
  }}>
    <div className="px-7 py-6 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FiCalendar style={{ color: 'rgba(251,146,60,0.6)', fontSize: 13 }} />
          <span className="text-xs font-medium capitalize" style={{ color: 'rgba(251,146,60,0.6)' }}>{frDate()}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f5ede8' }}>Tableau de Bord</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(251,146,60,0.55)' }}>
          Bienvenue,&nbsp;<span className="font-semibold" style={{ color: '#fb923c' }}>{username ?? '—'}</span>
        </p>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{
            background: 'rgba(249,115,22,0.12)',
            border: '1px solid rgba(249,115,22,0.25)',
            color: '#fb923c',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(249,115,22,0.22)';
            e.currentTarget.style.borderColor = 'rgba(249,115,22,0.45)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(249,115,22,0.12)';
            e.currentTarget.style.borderColor = 'rgba(249,115,22,0.25)';
          }}
        >
          <FiRefreshCw className="text-base" />
          Actualiser
        </button>
      )}
    </div>
    <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.4), rgba(245,158,11,0.2), transparent)' }} />
  </div>
);
