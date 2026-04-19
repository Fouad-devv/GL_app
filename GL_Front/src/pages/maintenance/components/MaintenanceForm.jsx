import { Button, ButtonGroup } from '../../../components/Button';
import { Input, Select, TextArea } from '../../../components/Form';
import { MAINTENANCE_OPERATION_TYPES, MAINTENANCE_FREQUENCIES, CONSUMABLE_TYPES } from '../../../utils/constants';

export const MaintenanceForm = ({ formData, machines, editingPoint, onChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <Select
      label="Machine"
      name="machineId"
      value={formData.machineId}
      onChange={onChange}
      options={machines.map((m) => ({ value: m.id, label: m.name }))}
      required
    />
    <Select
      label="Type d'opération"
      name="operationType"
      value={formData.operationType}
      onChange={onChange}
      options={MAINTENANCE_OPERATION_TYPES}
      required
    />
    <TextArea
      label="Description"
      name="description"
      value={formData.description}
      onChange={onChange}
      rows={3}
    />
    <Input
      label="Localisation sur la machine"
      name="location"
      value={formData.location}
      onChange={onChange}
    />
    <Select
      label="Type de consommable"
      name="consumableType"
      value={formData.consumableType}
      onChange={onChange}
      options={CONSUMABLE_TYPES}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Quantité"
        name="quantity"
        type="number"
        step="0.1"
        value={formData.quantity}
        onChange={onChange}
      />
      <Select
        label="Fréquence"
        name="frequency"
        value={formData.frequency}
        onChange={onChange}
        options={MAINTENANCE_FREQUENCIES}
        required
      />
    </div>
    <ButtonGroup className="justify-end gap-3 mt-6">
      <Button variant="outline" onClick={onCancel}>Annuler</Button>
      <Button variant="primary" type="submit">{editingPoint ? 'Mettre à jour' : 'Créer'}</Button>
    </ButtonGroup>
  </form>
);
