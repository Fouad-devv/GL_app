import { FiRefreshCw, FiCalendar } from 'react-icons/fi';

const frDate = () =>
  new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

export const DashboardHeader = ({ username, onRefresh }) => (
  <div
    className="mb-8 rounded-2xl overflow-hidden"
    style={{
      background: 'linear-gradient(135deg, #241305 0%, #160c02 45%, #0c0601 100%)',
      border: '1px solid rgba(249,115,22,0.18)',
      borderTop: '2px solid rgba(249,115,22,0.75)',
      boxShadow: '0 6px 36px rgba(0,0,0,0.55), 0 0 0 1px rgba(249,115,22,0.06)',
      position: 'relative',
    }}
  >
    {/* radial glow — top-left corner */}
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit',
      background: 'radial-gradient(ellipse 65% 100% at 0% 0%, rgba(249,115,22,0.1) 0%, transparent 70%)',
    }} />

    <div className="px-7 py-6 flex items-center justify-between" style={{ position: 'relative' }}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FiCalendar style={{ color: 'rgba(251,146,60,0.65)', fontSize: 13 }} />
          <span className="text-xs font-medium capitalize" style={{ color: 'rgba(251,146,60,0.65)' }}>
            {frDate()}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f5ede8' }}>
          Tableau de Bord
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(251,146,60,0.55)' }}>
          Bienvenue,&nbsp;
          <span className="font-semibold" style={{ color: '#fb923c' }}>{username ?? '—'}</span>
        </p>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: 'rgba(249,115,22,0.14)',
            border: '1px solid rgba(249,115,22,0.3)',
            color: '#fb923c',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(249,115,22,0.24)';
            e.currentTarget.style.borderColor = 'rgba(249,115,22,0.55)';
            e.currentTarget.style.boxShadow = '0 0 16px rgba(249,115,22,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(249,115,22,0.14)';
            e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FiRefreshCw size={14} />
          Actualiser
        </button>
      )}
    </div>

    {/* bottom accent line */}
    <div style={{
      height: 1,
      background: 'linear-gradient(90deg, rgba(249,115,22,0.5), rgba(245,158,11,0.25), transparent)',
    }} />
  </div>
);
