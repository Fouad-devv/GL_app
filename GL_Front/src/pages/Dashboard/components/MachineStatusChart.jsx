import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUSES = [
  { key: 'operational', label: 'En service',     color: '#10b981' },
  { key: 'maintenance', label: 'En maintenance', color: '#f59e0b' },
  { key: 'repair',      label: 'En réparation',  color: '#f97316' },
  { key: 'outOfService',label: 'Hors service',   color: '#ef4444' },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: d } = payload[0];
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2.5">
      <p className="text-sm font-semibold" style={{ color: d.color }}>{name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{value} machine{value !== 1 ? 's' : ''}</p>
    </div>
  );
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  if (!value) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const rad = Math.PI / 180;
  return (
    <text
      x={cx + r * Math.cos(-midAngle * rad)}
      y={cy + r * Math.sin(-midAngle * rad)}
      fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={12} fontWeight="700"
    >
      {value}
    </text>
  );
};

export const MachineStatusChart = ({ machines }) => {
  const data = STATUSES
    .map(s => ({ name: s.label, value: machines?.[s.key] ?? 0, color: s.color }))
    .filter(d => d.value > 0);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (!total) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Parc machines</p>
      <div className="flex items-center gap-1 mb-4">
        <span className="text-2xl font-bold text-gray-900">{total}</span>
        <span className="text-sm text-gray-400 mt-1">machines</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={60} outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={<CustomLabel />}
          >
            {data.map(d => (
              <Cell key={d.name} fill={d.color} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle" iconSize={9}
            formatter={v => <span style={{ fontSize: 12, color: '#6b7280' }}>{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
