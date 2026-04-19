import { FiSearch, FiPlus } from 'react-icons/fi';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Input, Select } from '../../../components/Form';
import { MACHINE_STATUS } from '../../../utils/constants';

export const MachinesToolbar = ({ searchTerm, onSearchChange, filterStatus, onFilterStatusChange, onSearch, onNew }) => (
  <Card className="mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Input
        placeholder="Rechercher une machine..."
        value={searchTerm}
        onChange={onSearchChange}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
      />
      <Select
        value={filterStatus}
        onChange={onFilterStatusChange}
        options={MACHINE_STATUS}
        placeholder="Filtrer par statut"
      />
      <Button variant="primary" onClick={onSearch}>
        <FiSearch className="inline mr-2" /> Rechercher
      </Button>
      <Button variant="success" onClick={onNew}>
        <FiPlus className="inline mr-2" /> Nouvelle machine
      </Button>
    </div>
  </Card>
);
