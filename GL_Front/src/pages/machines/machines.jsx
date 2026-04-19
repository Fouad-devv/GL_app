import { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Alert } from '../../components/Alert';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import useMachineAPI from '../../api/machineAPI.js';
import { MACHINE_TYPES, MACHINE_STATUS } from '../../utils/constants';
import { MachinesToolbar } from './components/MachinesToolbar';
import { MachineForm } from './components/MachineForm';

const COLUMNS = [
  { key: 'name',     label: 'Nom',          width: '150px' },
  { key: 'type',     label: 'Type',         width: '120px' },
  { key: 'brand',    label: 'Marque',       width: '120px' },
  { key: 'model',    label: 'Modèle',       width: '120px' },
  { key: 'location', label: 'Localisation', width: '150px' },
  {
    key: 'status', label: 'Statut', width: '120px',
    render: (status) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        status === 'EN_SERVICE'     ? 'bg-green-100 text-green-800' :
        status === 'EN_MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
        status === 'HORS_SERVICE'   ? 'bg-gray-100 text-gray-800' :
        'bg-red-100 text-red-800'
      }`}>
        {status === 'EN_SERVICE' ? 'En service' : status === 'EN_MAINTENANCE' ? 'En maintenance' : status === 'HORS_SERVICE' ? 'Hors service' : 'En réparation'}
      </span>
    ),
  },
];

const DEFAULT_FORM = {
  name: '', type: MACHINE_TYPES[0]?.value || '', status: MACHINE_STATUS[0]?.value || 'EN_SERVICE',
  brand: '', model: '', serialNumber: '', yearManufactured: new Date().getFullYear(),
  dateCommissioned: '', location: '', operatingHours: 0,
};

export const Machines = () => {
  const machineAPI = useMachineAPI();

  const [machines, setMachines]           = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [success, setSuccess]             = useState(null);
  const [searchTerm, setSearchTerm]       = useState('');
  const [filterStatus, setFilterStatus]   = useState('');
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [formData, setFormData]           = useState(DEFAULT_FORM);

  useEffect(() => { loadMachines(); }, [filterStatus]);

  const loadMachines = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      if (filterStatus) {
        response = await machineAPI.getMachinesByStatus(filterStatus);
        setMachines(response.data);
      } else {
        response = await machineAPI.getAllMachines();
        setMachines(response.data.content || response.data);
      }
    } catch (err) {
      console.error('Error loading machines:', err);
      setError('Erreur lors du chargement des machines');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) { loadMachines(); return; }
    try {
      setLoading(true);
      const response = await machineAPI.searchMachines(searchTerm);
      setMachines(response.data);
    } catch (err) {
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (machine = null) => {
    if (machine) {
      setEditingMachine(machine);
      setFormData({ name: machine.name, type: machine.type, brand: machine.brand, model: machine.model, serialNumber: machine.serialNumber, yearManufactured: machine.yearManufactured, dateCommissioned: machine.dateCommissioned, location: machine.location, status: machine.status, operatingHours: machine.operatingHours });
    } else {
      setEditingMachine(null);
      setFormData(DEFAULT_FORM);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setEditingMachine(null); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'operatingHours' ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (editingMachine) {
        await machineAPI.updateMachine(editingMachine.id, formData);
        setSuccess('Machine mise à jour avec succès');
      } else {
        await machineAPI.createMachine(formData);
        setSuccess('Machine créée avec succès');
      }
      handleCloseModal();
      loadMachines();
    } catch (err) {
      setError('Erreur lors de la sauvegarde de la machine');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (machine) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${machine.name} ?`)) return;
    try {
      setLoading(true);
      await machineAPI.deleteMachine(machine.id);
      setSuccess('Machine supprimée avec succès');
      loadMachines();
    } catch (err) {
      setError('Erreur lors de la suppression de la machine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Machines</h1>
        <p className="text-gray-600 mt-2">Gérez l'ensemble des machines de votre parc</p>
      </div>

      {error   && <Alert type="error"   message={error}   onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} duration={3000} />}
      <LoadingOverlay visible={loading} />

      <MachinesToolbar searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} filterStatus={filterStatus} onFilterStatusChange={(e) => setFilterStatus(e.target.value)} onSearch={handleSearch} onNew={() => handleOpenModal()} />

      <Card>
        <Table columns={COLUMNS} data={machines} onEdit={handleOpenModal} onDelete={handleDelete} loading={loading} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingMachine ? 'Éditer Machine' : 'Nouvelle Machine'} size="lg">
        <MachineForm formData={formData} editingMachine={editingMachine} onChange={handleInputChange} onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};
