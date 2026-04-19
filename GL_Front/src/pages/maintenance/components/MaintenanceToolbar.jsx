import { FiPlus, FiSearch } from 'react-icons/fi';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Form';

export const MaintenanceToolbar = ({ searchTerm, onSearchChange, onSearch, onNew }) => (
  <Card className="mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={onSearchChange}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
      />
      <Button variant="primary" onClick={onSearch}>
        <FiSearch className="inline mr-2" /> Rechercher
      </Button>
      <Button variant="success" onClick={onNew}>
        <FiPlus className="inline mr-2" /> Nouveau point
      </Button>
    </div>
  </Card>
);
