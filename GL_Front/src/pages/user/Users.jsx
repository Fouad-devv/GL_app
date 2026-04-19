import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Alert } from '../../components/Alert';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import useUserAPI from '../../api/userAPI.js';
import { UsersToolbar } from './components/UsersToolbar';
import { UserForm } from './components/UserForm';

const COLUMNS = [
  { key: 'fullName',    label: 'Nom complet', width: '150px' },
  { key: 'email',       label: 'Email',        width: '180px' },
  { key: 'role',        label: 'Rôle',         width: '120px' },
  { key: 'specialties', label: 'Spécialités',  width: '150px', render: (spec) => Array.isArray(spec) ? spec.join(', ') : spec },
  {
    key: 'active', label: 'Statut', width: '80px',
    render: (active) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {active ? 'Actif' : 'Inactif'}
      </span>
    ),
  },
];

export const Users = () => {
  const navigate = useNavigate();
  const userAPI  = useUserAPI();

  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(null);
  const [searchTerm, setSearchTerm]   = useState('');
  const [roleFilter, setRoleFilter]   = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages]   = useState(0);
  const [formData, setFormData] = useState({
    fullName: '', email: '', role: '', specialties: [], certifications: '', active: true,
  });

  useEffect(() => { loadUsers(); }, [currentPage, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      if (roleFilter) {
        response = await userAPI.getUsersByRole(roleFilter);
        setUsers(response.data);
      } else {
        response = await userAPI.getAllUsers(currentPage, 10);
        setUsers(response.data.content || response.data);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) { loadUsers(); return; }
    try {
      setLoading(true);
      const response = await userAPI.searchUsers(searchTerm);
      setUsers(response.data);
    } catch (err) {
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ fullName: user.fullName, email: user.email, role: user.role, specialties: user.specialties || [], certifications: user.certifications || '', active: user.active });
    } else {
      setEditingUser(null);
      setFormData({ fullName: '', email: '', role: '', specialties: [], certifications: '', active: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setEditingUser(null); };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSpecialtiesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormData((prev) => ({ ...prev, specialties: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (editingUser) {
        await userAPI.updateUser(editingUser.id, formData);
        setSuccess('Utilisateur mis à jour');
      } else {
        await userAPI.createUser(formData);
        setSuccess('Utilisateur créé');
      }
      handleCloseModal();
      loadUsers();
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.fullName} ?`)) return;
    try {
      setLoading(true);
      await userAPI.deleteUser(user.id);
      setSuccess('Utilisateur supprimé');
      loadUsers();
    } catch (err) {
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <p className="text-gray-600 mt-2">Gérez les techniciens et responsables</p>
      </div>

      {error   && <Alert type="error"   message={error}   onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} duration={3000} />}
      <LoadingOverlay visible={loading} />

      <UsersToolbar searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} roleFilter={roleFilter} onRoleFilterChange={(e) => setRoleFilter(e.target.value)} onSearch={handleSearch} onNew={() => navigate('/users/add-user')} />

      <Card>
        <Table columns={COLUMNS} data={users} onEdit={handleOpenModal} onDelete={handleDelete} loading={loading} pagination={{ currentPage, totalPages }} onPageChange={setCurrentPage} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}>
        <UserForm formData={formData} editingUser={editingUser} onChange={handleInputChange} onSpecialtiesChange={handleSpecialtiesChange} onSubmit={handleSubmit} onCancel={handleCloseModal} loading={loading} />
      </Modal>
    </div>
  );
};
