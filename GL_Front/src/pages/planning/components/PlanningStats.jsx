import { Card } from '../../../components/Card';

export const PlanningStats = ({ interventions }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <Card>
      <div className="text-center">
        <p className="text-gray-600">Interventions ce mois</p>
        <p className="text-3xl font-bold text-gray-900">{interventions.length}</p>
      </div>
    </Card>
    <Card>
      <div className="text-center">
        <p className="text-gray-600">Planifiées</p>
        <p className="text-3xl font-bold text-blue-600">{interventions.filter((i) => i.status === 'PLANIFIEE').length}</p>
      </div>
    </Card>
    <Card>
      <div className="text-center">
        <p className="text-gray-600">Terminées</p>
        <p className="text-3xl font-bold text-green-600">{interventions.filter((i) => i.status === 'TERMINEE').length}</p>
      </div>
    </Card>
  </div>
);
