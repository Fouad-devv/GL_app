import { FiRefreshCw, FiCalendar } from 'react-icons/fi';

const frDate = () =>
  new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

export const DashboardHeader = ({ username, onRefresh }) => (
  <div
    className="mb-3 rounded-2xl overflow-hidden h-[145px]"
    style={{
      background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.08)',
      borderTop: '3px solid #f97316',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
    }}
  >
    <div className="px-7 py-6 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FiCalendar style={{ color: '#f97316', fontSize: 13 }} />
          <span className="text-xs font-medium capitalize" style={{ color: '#f97316' }}>
            {frDate()}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#111827' }}>
          Tableau de Bord
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
          Bienvenue,&nbsp;
          <span className="font-semibold" style={{ color: '#ea580c' }}>{username ?? '—'}</span>
        </p>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: 'rgba(249,115,22,0.08)',
            border: '1px solid rgba(249,115,22,0.22)',
            color: '#ea580c',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(249,115,22,0.15)';
            e.currentTarget.style.borderColor = 'rgba(249,115,22,0.45)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(249,115,22,0.08)';
            e.currentTarget.style.borderColor = 'rgba(249,115,22,0.22)';
          }}
        >
          <FiRefreshCw size={14} />
          Actualiser
        </button>
      )}
    </div>
  </div>
);
