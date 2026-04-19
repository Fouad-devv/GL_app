import { FiSearch, FiPlus } from 'react-icons/fi';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Select } from '../../../components/Form';
import { INTERVENTION_STATUS } from '../../../utils/constants';

export const InterventionsToolbar = ({ statusFilter, onStatusFilterChange, onReset, onNew, isAdmin }) => (
  <Card className="mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Select
        value={statusFilter}
        onChange={onStatusFilterChange}
        options={INTERVENTION_STATUS}
        placeholder="Filtrer par statut"
      />
      <Button variant="primary" onClick={onReset}>
        <FiSearch className="inline mr-2" /> Réinitialiser
      </Button>
      {isAdmin && (
        <Button variant="success" onClick={onNew}>
          <FiPlus className="inline mr-2" /> Nouvelle intervention
        </Button>
      )}
    </div>
  </Card>
);
