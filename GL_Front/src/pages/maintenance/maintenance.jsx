import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw } from 'react-icons/fi';
import { Card } from '../../components/Card';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Alert } from '../../components/Alert';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import useMaintenancePointAPI from '../../api/maintenancePointAPI.js';
import useMachineAPI from '../../api/machineAPI';
import { MaintenanceToolbar } from './components/MaintenanceToolbar';
import { MaintenanceForm } from './components/MaintenanceForm';

const COLUMNS = [
  { key: 'machineName',    label: 'Machine',          width: '150px', render: (val) => val ?? '—' },
  { key: 'operationType',  label: 'Type',             width: '130px' },
  { key: 'frequency',      label: 'Fréquence',        width: '120px' },
  { key: 'consumableType', label: 'Type consommable', width: '120px' },
  { key: 'quantity',       label: 'Quantité',         width: '80px'  },
];

export const Maintenance = () => {
  const navigate       = useNavigate();
  const maintenanceAPI = useMaintenancePointAPI();
  const machineAPI     = useMachineAPI();

  const [points, setPoints]             = useState([]);
  const [machines, setMachines]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [success, setSuccess]           = useState(null);
  const [searchTerm, setSearchTerm]     = useState('');
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [currentPage, setCurrentPage]   = useState(0);
  const [totalPages, setTotalPages]     = useState(0);
  const [formData, setFormData] = useState({
    machineId: '', operationType: 'GRAISSAGE', description: '',
    location: '', consumableType: 'GRAISSE', quantity: 0, frequency: 'QUOTIDIENNE',
  });

  useEffect(() => {
    loadMachines();
    loadPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadMachines = async () => {
    try {
      const response = await machineAPI.getAllMachines();
      setMachines(response.data || []);
    } catch (err) {
      console.error('Error loading machines:', err);
      setError('Erreur lors du chargement des machines');
    }
  };

  const loadPoints = async () => {
    try {
      setLoading(true);
      const response = await maintenanceAPI.getAllPoints(currentPage, 10);
      setPoints(response.data.content || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des points de maintenance');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) { loadPoints(); return; }
    try {
      setLoading(true);
      const response = await maintenanceAPI.getAllPoints(0, 100);
      const filtered = response.data.content?.filter(
        (p) => p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               p.operationType.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
      setPoints(filtered);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (point = null) => {
    const firstMachine = machines[0];
    if (point) {
      setEditingPoint(point);
      setFormData({ machineId: point.machineId, operationType: point.operationType, description: point.description, location: point.location, consumableType: point.consumableType, quantity: point.quantity, frequency: point.frequency });
    } else {
      setEditingPoint(null);
      setFormData({ machineId: firstMachine?.id || '', operationType: 'GRAISSAGE', description: '', location: '', consumableType: 'GRAISSE', quantity: 0, frequency: 'QUOTIDIENNE' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setEditingPoint(null); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'quantity' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (editingPoint) {
        await maintenanceAPI.updatePoint(editingPoint.id, formData);
        setSuccess('Point de maintenance mis à jour');
      } else {
        await maintenanceAPI.createPoint(formData);
        setSuccess('Point de maintenance créé');
      }
      handleCloseModal();
      loadPoints();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (point) => {
    if (!window.confirm('Êtes-vous sûr ?')) return;
    try {
      setLoading(true);
      await maintenanceAPI.deletePoint(point.id);
      setSuccess('Point supprimé');
      loadPoints();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Points de Maintenance</h1>
          <p className="text-gray-600 mt-2">Gérez les points de maintenance pour chaque machine</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow transition flex-shrink-0 mt-1"
        >
          <FiRefreshCw size={14} /> Actualiser
        </button>
      </div>

      {error   && <Alert type="error"   message={error}   onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} duration={3000} />}
      <LoadingOverlay visible={loading} />

      <MaintenanceToolbar searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} onSearch={handleSearch} onNew={() => handleOpenModal()} />

      <Card>
        <Table columns={COLUMNS} data={points} onEdit={handleOpenModal} onDelete={handleDelete} onRowClick={(point) => navigate(`/maintenance/${point.id}`)} loading={loading} pagination={{ currentPage, totalPages }} onPageChange={setCurrentPage} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingPoint ? 'Éditer Point' : 'Nouveau Point de Maintenance'} size="lg">
        <MaintenanceForm formData={formData} machines={machines} editingPoint={editingPoint} onChange={handleInputChange} onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};
