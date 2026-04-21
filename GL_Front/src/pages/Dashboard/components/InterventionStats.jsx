const SUMMARY = [
  { key: 'totalInterventions', label: 'Total interventions', color: '#3b82f6', bg: '#eff6ff' },
  { key: 'activeMachines',     label: 'Machines en service', color: '#10b981', bg: '#ecfdf5' },
  { key: 'technicians',        label: 'Techniciens',         color: '#8b5cf6', bg: '#f5f3ff' },
];

export const InterventionStats = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      {SUMMARY.map(({ key, label, color, bg }) => (
        <div
          key={key}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center gap-4"
        >
          <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: color }} />
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color }}>{stats[key] ?? 0}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
