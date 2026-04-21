import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { Card } from '../../../components/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2">
      <p className="font-semibold text-gray-800 text-sm">{label}</p>
      <p className="text-sm" style={{ color: value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444' }}>
        Disponibilité : <strong>{value.toFixed(1)}%</strong>
      </p>
    </div>
  );
};

const barColor = (value) => {
  if (value >= 80) return '#10b981';
  if (value >= 60) return '#f59e0b';
  return '#ef4444';
};

export const MachineAvailabilityChart = ({ data }) => {
  if (!data?.length) return null;

  const chartData = data.map(m => ({
    name: m.machineName || m.name || `Machine ${m.machineId}`,
    availability: Number((m.availabilityRate ?? m.availability ?? 0).toFixed(1)),
  }));

  return (
    <Card title="Disponibilité des machines" subtitle="Taux de disponibilité par machine (%)">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#6b7280' }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
          <ReferenceLine y={80} stroke="#10b981" strokeDasharray="4 4" label={{ value: '80%', position: 'right', fontSize: 10, fill: '#10b981' }} />
          <Bar dataKey="availability" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {chartData.map(({ name, availability }) => (
              <Cell key={name} fill={barColor(availability)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
