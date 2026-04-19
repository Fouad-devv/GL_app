import { Select } from '../../../components/Form';
import { USER_ROLES, SPECIALTIES } from '../../../utils/constants';

export const RoleSection = ({ formData, onChange, onSpecialtiesChange }) => (
  <div>
    <h3 className="text-lg font-bold text-gray-900 mb-4">Rôle et responsabilités</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select label="Rôle" name="role" value={formData.role} onChange={onChange} options={USER_ROLES} placeholder="Sélectionnez un rôle" required />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Spécialités</label>
        <select
          multiple
          value={formData.specialties}
          onChange={onSpecialtiesChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ minHeight: '120px' }}
        >
          {SPECIALTIES.map((spec) => (
            <option key={spec.value} value={spec.value}>{spec.label}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Tenez Ctrl+Clic pour sélectionner plusieurs</p>
      </div>
    </div>
  </div>
);
