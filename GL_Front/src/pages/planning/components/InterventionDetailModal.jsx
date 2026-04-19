import { Modal } from '../../../components/Modal';
import { formatDate } from '../../../utils/dateUtils';

export const InterventionDetailModal = ({ isOpen, onClose, intervention }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Détails de l'intervention" size="md">
    {intervention && (
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">Machine</p>
          <p className="font-bold">{intervention.machineName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Type</p>
          <p className="font-bold">{intervention.operationType}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Date planifiée</p>
          <p className="font-bold">{formatDate(intervention.plannedDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Technicien</p>
          <p className="font-bold">{intervention.technicianName || 'Non assigné'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Statut</p>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            intervention.status === 'PLANIFIEE' ? 'bg-blue-100 text-blue-800' :
            intervention.status === 'EN_COURS'  ? 'bg-yellow-100 text-yellow-800' :
            intervention.status === 'TERMINEE'  ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {intervention.status}
          </span>
        </div>
      </div>
    )}
  </Modal>
);
