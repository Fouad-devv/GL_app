import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Card } from '../../components/Card';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Alert } from '../../components/Alert';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import useInterventionAPI from '../../api/interventionAPI.js';
import useMachineAPI from '../../api/machineAPI';
import useUserAPI from '../../api/userAPI';
import { formatDate } from '../../utils/dateUtils';
import { InterventionsToolbar } from './components/InterventionsToolbar';
import { InterventionForm } from './components/InterventionForm';

const COLUMNS = [
  { key: 'machineName',     label: 'Machine',        width: '150px' },
  { key: 'plannedDate',     label: 'Date planifiée', width: '120px', render: (val) => formatDate(val) },
  { key: 'technicianName',  label: 'Technicien',     width: '150px' },
  { key: 'durationMinutes', label: 'Durée (min)',    width: '100px' },
  { key: 'cost',           label: 'Coût (MAD)',     width: '110px', render: (val) => val != null ? `${Number(val).toLocaleString('fr-MA')} MAD` : '—' },
  {
    key: 'status', label: 'Statut', width: '120px',
    render: (status) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        status === 'PLANIFIEE' ? 'bg-blue-100 text-blue-800' :
        status === 'EN_COURS'  ? 'bg-yellow-100 text-yellow-800' :
        status === 'TERMINEE'  ? 'bg-green-100 text-green-800' :
        'bg-red-100 text-red-800'
      }`}>{status}</span>
    ),
  },
];

export const Interventions = () => {
  const { keycloak } = useKeycloak();
  const roles        = keycloak.tokenParsed?.realm_access?.roles || [];
  const isAdmin      = roles.includes('admin');
  const isTechnicien = roles.includes('technicien');

  const interventionAPI = useInterventionAPI();
  const machineAPI      = useMachineAPI();
  const userAPI         = useUserAPI();

  const [interventions, setInterventions]             = useState([]);
  const [machines, setMachines]                       = useState([]);
  const [technicians, setTechnicians]                 = useState([]);
  const [loading, setLoading]                         = useState(false);
  const [error, setError]                             = useState(null);
  const [success, setSuccess]                         = useState(null);
  const [statusFilter, setStatusFilter]               = useState('');
  const [isModalOpen, setIsModalOpen]                 = useState(false);
  const [editingIntervention, setEditingIntervention] = useState(null);
  const [currentPage, setCurrentPage]                 = useState(0);
  const [totalPages, setTotalPages]                   = useState(0);
  const [formData, setFormData] = useState({
    machineId: null, technicianId: null, plannedDate: '', plannedTime: '',
    actualDate: '', actualTime: '', durationMinutes: 0,
    status: 'PLANIFIEE', observations: '', equipmentState: 'NORMAL', cost: '',
  });

  useEffect(() => {
    const init = async () => {
      await loadMachines();
      if (!isTechnicien) await loadTechnicians();
      await loadInterventions();
    };
    init();
  }, [currentPage, statusFilter]);

  const displayedInterventions = isTechnicien && statusFilter
    ? interventions.filter((i) => i.status === statusFilter)
    : interventions;

  const loadInterventions = async () => {
    try {
      setLoading(true);
      let response;
      if (isTechnicien) {
        const meRes = await userAPI.getMe();
        response = await interventionAPI.getInterventionsByTechnician(meRes.data.id);
        setInterventions(response.data || []);
        setTotalPages(1);
      } else if (statusFilter) {
        response = await interventionAPI.getInterventionsByStatus(statusFilter);
        setInterventions(response.data);
      } else {
        response = await interventionAPI.getAllInterventions(currentPage, 10);
        setInterventions(response.data.content || response.data);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err) {
      setError('Erreur lors du chargement des interventions');
    } finally {
      setLoading(false);
    }
  };

  const loadMachines    = async () => { try { const r = await machineAPI.getAllMachines();    setMachines(r.data || []);    } catch (err) { console.error(err); } };
  const loadTechnicians = async () => { try { const r = await userAPI.getTechnicians();       setTechnicians(r.data || []); } catch (err) { console.error(err); } };

  const handleOpenModal = (intervention = null) => {
    if (intervention) {
      setEditingIntervention(intervention);
      setFormData({
        machineId: intervention.machineId ? Number(intervention.machineId) : null,
        technicianId: intervention.technicianId ? Number(intervention.technicianId) : null,
        plannedDate: intervention.plannedDate || '', plannedTime: intervention.plannedTime || '',
        actualDate: intervention.actualDate || '', actualTime: intervention.actualTime || '',
        durationMinutes: intervention.durationMinutes || 0, status: intervention.status || 'PLANIFIEE',
        observations: intervention.observations || '', equipmentState: intervention.equipmentState || 'NORMAL',
        cost: intervention.cost ?? '',
      });
    } else {
      setEditingIntervention(null);
      setFormData({ machineId: machines[0] ? Number(machines[0].id) : null, technicianId: technicians[0] ? Number(technicians[0].id) : null, plannedDate: '', plannedTime: '', actualDate: '', actualTime: '', durationMinutes: 0, status: 'PLANIFIEE', observations: '', equipmentState: 'NORMAL', cost: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setEditingIntervention(null); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const idFields = ['machineId', 'technicianId', 'maintenancePointId'];
    const numericFields = ['durationMinutes', 'cost'];
    setFormData((prev) => ({ ...prev, [name]: idFields.includes(name) ? (value === '' ? null : Number(value)) : numericFields.includes(name) ? (value === '' ? '' : parseFloat(value) || 0) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (editingIntervention) {
        await interventionAPI.updateIntervention(editingIntervention.id, formData);
        setSuccess('Intervention mise à jour');
      } else {
        await interventionAPI.createIntervention(formData);
        setSuccess('Intervention créée');
      }
      handleCloseModal();
      loadInterventions();
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (intervention) => {
    if (!window.confirm('Êtes-vous sûr ?')) return;
    try {
      setLoading(true);
      await interventionAPI.deleteIntervention(intervention.id);
      setSuccess('Intervention supprimée');
      loadInterventions();
    } catch (err) {
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Interventions de Maintenance</h1>
        <p className="text-gray-600 mt-2">Suivez et gérez toutes les interventions</p>
      </div>

      {error   && <Alert type="error"   message={error}   onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} duration={3000} />}
      <LoadingOverlay visible={loading} />

      <InterventionsToolbar statusFilter={statusFilter} onStatusFilterChange={(e) => setStatusFilter(e.target.value)} onReset={() => setStatusFilter('')} onNew={() => handleOpenModal()} isAdmin={isAdmin} />

      <Card>
        <Table columns={COLUMNS} data={displayedInterventions} onEdit={handleOpenModal} onDelete={handleDelete} loading={loading} pagination={{ currentPage, totalPages }} onPageChange={setCurrentPage} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingIntervention ? 'Éditer Intervention' : 'Nouvelle Intervention'} size="xl">
        <InterventionForm formData={formData} machines={machines} technicians={technicians} editingIntervention={editingIntervention} onChange={handleInputChange} onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};
