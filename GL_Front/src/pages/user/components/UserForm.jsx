import { Button, ButtonGroup } from '../../../components/Button';
import { Input, Select, TextArea } from '../../../components/Form';
import { USER_ROLES, SPECIALTIES } from '../../../utils/constants';

export const UserForm = ({ formData, editingUser, onChange, onSpecialtiesChange, onSubmit, onCancel, loading }) => (
  <form onSubmit={onSubmit}>
    <div className="flex flex-col gap-4">
      <Input name="fullName" placeholder="Nom complet" value={formData.fullName} onChange={onChange} required />
      <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={onChange} required />
      <Select name="role" value={formData.role} onChange={onChange} options={USER_ROLES} placeholder="Choisir un rôle" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Spécialités</label>
        <select
          multiple
          value={formData.specialties}
          onChange={onSpecialtiesChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SPECIALTIES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl pour sélectionner plusieurs spécialités</p>
      </div>

      <TextArea name="certifications" placeholder="Certifications" value={formData.certifications} onChange={onChange} />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="active"
          checked={formData.active}
          onChange={onChange}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700">Utilisateur actif</span>
      </label>

      <ButtonGroup>
        <Button variant="secondary" type="button" onClick={onCancel}>Annuler</Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {editingUser ? 'Mettre à jour' : 'Créer'}
        </Button>
      </ButtonGroup>
    </div>
  </form>
);
