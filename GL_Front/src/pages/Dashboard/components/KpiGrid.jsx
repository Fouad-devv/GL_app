import { useState, useEffect } from 'react';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiDollarSign } from 'react-icons/fi';

const CARDS = [
  {
    key: 'completedInterventions',
    title: 'Interventions terminées',
    fmt: v => Math.round(v ?? 0),
    icon: FiCheckCircle,
    accent: '#10b981',
    iconBg: '#ecfdf5',
    val: '#065f46',
  },
  {
    key: 'avgInterventionTime',
    title: 'Durée moyenne (min)',
    fmt: v => Math.round(v ?? 0),
    icon: FiClock,
    accent: '#8b5cf6',
    iconBg: '#f5f3ff',
    val: '#4c1d95',
  },
  {
    key: 'delayedInterventions',
    title: 'Interventions en retard',
    fmt: v => Math.round(v ?? 0),
    icon: FiAlertTriangle,
    accent: '#ef4444',
    iconBg: '#fef2f2',
    val: '#991b1b',
  },
  {
    key: 'monthlyCost',
    title: 'Coûts du mois',
    fmt: v => `${Math.round(v ?? 0).toLocaleString('fr-MA')} MAD`,
    icon: FiDollarSign,
    accent: '#06b6d4',
    iconBg: '#ecfeff',
    val: '#164e63',
  },
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

const KpiCard = ({ card, kpis, delay }) => {
  const { title, fmt, icon: Icon, accent, iconBg, val } = card;
  const rawVal = Number(kpis?.[card.key] ?? 0);
  const count  = useCounter(rawVal);

  return (
    <div
      className="kpi-card bg-white rounded-2xl p-4"
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        borderTop: `3px solid ${accent}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        animation: `dash-up 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="rounded-lg p-2 flex-shrink-0" style={{ background: iconBg }}>
          <Icon size={16} style={{ color: accent }} />
        </div>
      </div>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider leading-4 mb-1">
        {title}
      </p>
      <p className="text-2xl font-bold leading-none" style={{ color: val }}>
        {fmt(count)}
      </p>
    </div>
  );
};

export const KpiGrid = ({ kpis }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {CARDS.map((card, i) => (
      <KpiCard key={card.key} card={card} kpis={kpis} delay={i * 70} />
    ))}
  </div>
);
