import { useState, useEffect } from 'react';
import { FiLayers, FiServer, FiUsers } from 'react-icons/fi';

const SUMMARY = [
  { key: 'totalInterventions', label: 'Total interventions', color: '#3b82f6', icon: FiLayers },
  { key: 'activeMachines',     label: 'Machines en service', color: '#10b981', icon: FiServer },
  { key: 'technicians',        label: 'Techniciens',         color: '#8b5cf6', icon: FiUsers  },
];

function useCounter(target, duration = 950) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(t >= 1 ? target : Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

const StatCard = ({ label, value, color, icon: Icon, delay }) => {
  const count = useCounter(Number(value ?? 0));
  return (
    <div
      className="stat-card bg-white rounded-2xl p-5"
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        borderTop: `3px solid ${color}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        animation: `dash-up 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div
          className="rounded-xl p-2.5 flex-shrink-0"
          style={{ background: `${color}18` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</p>
      <p className="text-3xl font-bold leading-none" style={{ color }}>{count}</p>
    </div>
  );
};

export const InterventionStats = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {SUMMARY.map(({ key, label, color, icon }, i) => (
        <StatCard key={key} label={label} value={stats[key]} color={color} icon={icon} delay={i * 70} />
      ))}
    </div>
  );
};
