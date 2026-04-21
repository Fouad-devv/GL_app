const R = 54;
const TOTAL = Math.PI * R; // semicircle arc length

const Gauge = ({ value, label, color, bg }) => {
  const pct = Math.min(Math.max(value ?? 0, 0), 100);
  const filled = (pct / 100) * TOTAL;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 148, height: 82 }}>
        <svg viewBox="0 0 148 82" width="148" height="82">
          {/* track */}
          <path
            d="M 20 74 A 54 54 0 0 1 128 74"
            fill="none" stroke="#f1f5f9" strokeWidth="13" strokeLinecap="round"
          />
          {/* value */}
          <path
            d="M 20 74 A 54 54 0 0 1 128 74"
            fill="none" stroke={color} strokeWidth="13" strokeLinecap="round"
            strokeDasharray={`${filled} ${TOTAL}`}
            style={{ transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-2xl font-bold leading-none" style={{ color }}>{Math.round(pct)}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-500 mt-1 text-center leading-tight">{label}</p>
    </div>
  );
};

const MiniStat = ({ label, value, color }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-bold" style={{ color }}>{value}</span>
  </div>
);

export const PerformanceGauges = ({ kpis, stats }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">Performance globale</p>

    <div className="flex justify-around mb-6">
      <Gauge
        value={kpis?.implementationRate}
        label="Taux de réalisation"
        color="#3b82f6"
      />
      <Gauge
        value={kpis?.machineAvailability}
        label="Disponibilité machines"
        color="#10b981"
      />
    </div>

    <div className="mt-2">
      <MiniStat
        label="Total interventions"
        value={stats?.totalInterventions ?? kpis?.totalInterventions ?? 0}
        color="#6b7280"
      />
      <MiniStat
        label="Terminées"
        value={kpis?.completedInterventions ?? 0}
        color="#10b981"
      />
      <MiniStat
        label="En retard"
        value={kpis?.delayedInterventions ?? 0}
        color="#ef4444"
      />
      <MiniStat
        label="Techniciens"
        value={stats?.technicians ?? 0}
        color="#8b5cf6"
      />
    </div>
  </div>
);
