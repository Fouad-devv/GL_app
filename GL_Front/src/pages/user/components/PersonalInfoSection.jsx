import { Input } from '../../../components/Form';

export const PersonalInfoSection = ({ formData, onChange }) => (
  <div>
    <h3 className="text-lg font-bold text-gray-900 mb-4">Informations personnelles</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Nom complet" name="fullName" value={formData.fullName} onChange={onChange} placeholder="ex: Jean Dupont" required />
      <Input label="Email" name="email" type="email" value={formData.email} onChange={onChange} placeholder="ex: jean.dupont@example.com" required />
    </div>
  </div>
);
