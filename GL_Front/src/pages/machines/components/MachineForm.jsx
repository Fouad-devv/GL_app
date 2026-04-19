import { Button, ButtonGroup } from '../../../components/Button';
import { Input, Select, FormGroup } from '../../../components/Form';
import { MACHINE_TYPES, MACHINE_STATUS } from '../../../utils/constants';

export const MachineForm = ({ formData, editingMachine, onChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <FormGroup>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nom de la machine" name="name" value={formData.name} onChange={onChange} required />
        <Select label="Type" name="type" value={formData.type} onChange={onChange} options={MACHINE_TYPES} required />
      </div>
    </FormGroup>

    <FormGroup>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Marque" name="brand" value={formData.brand} onChange={onChange} />
        <Input label="Modèle" name="model" value={formData.model} onChange={onChange} />
      </div>
    </FormGroup>

    <FormGroup>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Numéro de série" name="serialNumber" value={formData.serialNumber} onChange={onChange} />
        <Input label="Année de fabrication" name="yearManufactured" type="number" value={formData.yearManufactured} onChange={onChange} />
      </div>
    </FormGroup>

    <FormGroup>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Date de mise en service" name="dateCommissioned" type="date" value={formData.dateCommissioned} onChange={onChange} />
        <Input label="Localisation" name="location" value={formData.location} onChange={onChange} />
      </div>
    </FormGroup>

    <FormGroup>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Statut" name="status" value={formData.status} onChange={onChange} options={MACHINE_STATUS} />
        <Input label="Heures de fonctionnement" name="operatingHours" type="number" value={formData.operatingHours} onChange={onChange} />
      </div>
    </FormGroup>

    <ButtonGroup className="justify-end gap-3 mt-6">
      <Button variant="outline" onClick={onCancel}>Annuler</Button>
      <Button variant="primary" type="submit">{editingMachine ? 'Mettre à jour' : 'Créer'}</Button>
    </ButtonGroup>
  </form>
);
