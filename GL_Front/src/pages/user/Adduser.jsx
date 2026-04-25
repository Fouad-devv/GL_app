import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { FiRefreshCw } from 'react-icons/fi';
import { Card } from '../../components/Card';
import { Button, ButtonGroup } from '../../components/Button';
import { Alert } from '../../components/Alert';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import useUserAPI from '../../api/userAPI';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { AuthSection } from './components/AuthSection';
import { RoleSection } from './components/RoleSection';
import { CertificationsSection } from './components/CertificationsSection';
import { AddUserTips } from './components/AddUserTips';

const EMPTY_FORM = {
  fullName: '', email: '', password: '', confirmPassword: '',
  role: '', specialties: [], certifications: '', active: true,
};

export const AddUser = () => {
  useDocumentTitle('Nouvel Utilisateur');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const navigate = useNavigate();
  const userAPI  = useUserAPI();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSpecialtiesChange = (e) => {
    const selected = Array.from(e.target.options).filter((o) => o.selected).map((o) => o.value);
    setFormData((prev) => ({ ...prev, specialties: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.role) { setError('Veuillez remplir tous les champs obligatoires'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Les mots de passe ne correspondent pas'); return; }
    try {
      setLoading(true);
      setError(null);
      await userAPI.createUser({ fullName: formData.fullName, email: formData.email, password: formData.password, role: formData.role, specialties: formData.specialties, certifications: formData.certifications, active: formData.active });
      setSuccess('Utilisateur créé avec succès');
      setFormData(EMPTY_FORM);
      setTimeout(() => setSuccess(null), 3000);
      navigate('/users');
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.message || "Erreur lors de la création de l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setFormData(EMPTY_FORM); setError(null); };

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0 flex justify-center">
      <div className="w-[1300px]">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Créer un nouvel utilisateur</h1>
              <p className="text-gray-600 mt-2">Ajoutez un nouveau technicien ou responsable au système</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow transition flex-shrink-0 mt-1"
            >
              <FiRefreshCw size={14} /> Actualiser
            </button>
          </div>
        </div>

        {error   && <Alert type="error"   message={error}   onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
        <LoadingOverlay visible={loading} />

        <Card className="w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PersonalInfoSection   formData={formData} onChange={handleInputChange} />
            <AuthSection           formData={formData} onChange={handleInputChange} />
            <RoleSection           formData={formData} onChange={handleInputChange} onSpecialtiesChange={handleSpecialtiesChange} />
            <CertificationsSection formData={formData} onChange={handleInputChange} />

            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <input type="checkbox" id="active" name="active" checked={formData.active} onChange={handleInputChange} className="rounded border-gray-300" />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Utilisateur actif (peut se connecter immédiatement)
              </label>
            </div>

            <ButtonGroup className="justify-end gap-3 pt-6 border-t border-gray-200">
              <Button variant="outline" type="button" onClick={() => { handleReset(); navigate('/users'); }}>Annuler</Button>
              <Button variant="outline" type="button" onClick={handleReset}>Réinitialiser</Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Création en cours...' : "Créer l'utilisateur"}
              </Button>
            </ButtonGroup>
          </form>
        </Card>

        <AddUserTips />
      </div>
    </div>
  );
};
