import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../../../components/Card';

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2">
      <p className="font-semibold text-gray-700 text-sm mb-1">{label}</p>
      <p className="text-blue-600 text-sm">
        Coût : <strong>{Number(payload[0].value).toLocaleString('fr-MA')} MAD</strong>
      </p>
    </div>
  );
};

const normalise = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(item => ({
      month: item.month
        ? (typeof item.month === 'string' && item.month.length > 4
            ? `${MONTH_LABELS[new Date(item.month).getMonth()]} ${new Date(item.month).getFullYear()}`
            : item.month)
        : item.label || item.period || '',
      cost: Number(item.totalCost ?? item.cost ?? item.amount ?? 0),
    }));
  }
  // object keyed by month string
  return Object.entries(raw).map(([k, v]) => ({
    month: k,
    cost: Number(v),
  }));
};

export const CostsTrendChart = ({ data }) => {
  const chartData = normalise(data);
  if (!chartData.length) return null;

  const max = Math.max(...chartData.map(d => d.cost));

  return (
    <Card title="Évolution des coûts de maintenance" subtitle="Coûts mensuels (MAD)">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
          <YAxis
            domain={[0, max * 1.15 || 100]}
            tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cost"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#costGrad)"
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
