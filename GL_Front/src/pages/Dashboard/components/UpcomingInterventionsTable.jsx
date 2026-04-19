import { Card } from '../../../components/Card';
import { formatDate } from '../../../utils/dateUtils';

export const UpcomingInterventionsTable = ({ interventions }) => (
  <Card title="Interventions à venir (7 jours)" className="mb-8">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Machine</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Statut</th>
          </tr>
        </thead>
        <tbody>
          {interventions.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-4 py-4 text-center text-gray-500">Aucune intervention planifiée</td>
            </tr>
          ) : (
            interventions.map((intervention, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">{intervention.machineName}</td>
                <td className="px-4 py-3">{formatDate(intervention.plannedDate)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    intervention.status === 'PLANIFIEE' ? 'bg-blue-100 text-blue-800' :
                    intervention.status === 'EN_COURS'  ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {intervention.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </Card>
);
