import { Button, ButtonGroup } from '../../../components/Button';
import { Input, Select, TextArea } from '../../../components/Form';
import { INTERVENTION_STATUS, EQUIPMENT_STATE } from '../../../utils/constants';
import { MaintenancePointPicker } from './MaintenancePointPicker';

export const InterventionForm = ({ formData, machines, technicians, maintenancePoints = [], editingIntervention, onChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select
        label="Machine"
        name="machineId"
        value={formData.machineId}
        onChange={onChange}
        options={machines.map((m) => ({ value: m.id, label: m.name }))}
        required
      />
      <Select
        label="Technicien"
        name="technicianId"
        value={formData.technicianId}
        onChange={onChange}
        options={technicians.map((t) => ({ value: t.id, label: t.fullName }))}
      />
    </div>

    <MaintenancePointPicker
      points={maintenancePoints}
      value={formData.maintenancePointId}
      onChange={onChange}
      machineSelected={!!formData.machineId}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Date planifiée" name="plannedDate" type="date" value={formData.plannedDate} onChange={onChange} required />
      <Input label="Heure planifiée" name="plannedTime" type="time" value={formData.plannedTime} onChange={onChange} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Date réelle" name="actualDate" type="date" value={formData.actualDate} onChange={onChange} />
      <Input label="Heure réelle" name="actualTime" type="time" value={formData.actualTime} onChange={onChange} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input label="Durée (minutes)" name="durationMinutes" type="number" value={formData.durationMinutes} onChange={onChange} />
      <Input label="Coût (MAD)" name="cost" type="number" min="0" step="0.01" value={formData.cost} onChange={onChange} placeholder="0.00" />
      <Select label="Statut" name="status" value={formData.status} onChange={onChange} options={INTERVENTION_STATUS} />
    </div>

    <Select label="État du matériel" name="equipmentState" value={formData.equipmentState} onChange={onChange} options={EQUIPMENT_STATE} />

    <TextArea label="Observations" name="observations" value={formData.observations} onChange={onChange} rows={4} />

    <ButtonGroup className="justify-end gap-3 mt-6">
      <Button variant="outline" type="button" onClick={onCancel}>Annuler</Button>
      <Button variant="primary" type="submit">{editingIntervention ? 'Mettre à jour' : 'Créer'}</Button>
    </ButtonGroup>
  </form>
);
