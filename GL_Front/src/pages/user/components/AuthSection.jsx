import { Input } from '../../../components/Form';

export const AuthSection = ({ formData, onChange }) => (
  <div>
    <h3 className="text-lg font-bold text-gray-900 mb-4">Authentification</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Mot de passe" name="password" type="password" value={formData.password} onChange={onChange} placeholder="Entrez un mot de passe sécurisé" required />
      <Input label="Confirmer le mot de passe" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={onChange} placeholder="Confirmez le mot de passe" required />
    </div>
  </div>
);
