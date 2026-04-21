import { FiAlertTriangle, FiX } from 'react-icons/fi';

export const AlertsSection = ({ alerts }) => {
  if (!alerts?.length) return null;
  return (
    <div className="mb-8 space-y-3">
      {alerts.slice(0, 5).map((alert, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 px-5 py-4 rounded-2xl border"
          style={{ background: '#fffbeb', borderColor: '#fbbf2455' }}
        >
          <div className="mt-0.5 p-1.5 rounded-lg flex-shrink-0" style={{ background: '#fef3c7' }}>
            <FiAlertTriangle style={{ color: '#d97706', fontSize: 14 }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">{alert.title}</p>
            <p className="text-xs text-amber-700 mt-0.5">{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
