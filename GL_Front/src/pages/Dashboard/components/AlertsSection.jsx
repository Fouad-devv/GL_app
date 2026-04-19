import { FiAlertCircle } from 'react-icons/fi';
import { Card } from '../../../components/Card';

export const AlertsSection = ({ alerts }) => {
  if (!alerts.length) return null;
  return (
    <Card title="Alertes" className="mb-8">
      <div className="space-y-3">
        {alerts.slice(0, 5).map((alert, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <FiAlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{alert.title}</p>
              <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
