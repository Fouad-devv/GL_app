import { FiPlus, FiSearch } from 'react-icons/fi';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Input, Select } from '../../../components/Form';
import { USER_ROLES } from '../../../utils/constants';

export const UsersToolbar = ({ searchTerm, onSearchChange, roleFilter, onRoleFilterChange, onSearch, onNew }) => (
  <Card className="mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Input
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={onSearchChange}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
      />
      <Select
        value={roleFilter}
        onChange={onRoleFilterChange}
        options={USER_ROLES}
        placeholder="Filtrer par rôle"
      />
      <Button variant="primary" onClick={onSearch}>
        <FiSearch className="inline mr-2" /> Rechercher
      </Button>
      <Button variant="success" onClick={onNew}>
        <FiPlus className="inline mr-2" /> Nouvel utilisateur
      </Button>
    </div>
  </Card>
);
