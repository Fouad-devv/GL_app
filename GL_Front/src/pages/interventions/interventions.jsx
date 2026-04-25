import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { FiRefreshCw } from 'react-icons/fi';
import { Card } from '../../components/Card';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Alert } from '../../components/Alert';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import useInterventionAPI from '../../api/interventionAPI.js';
import useMachineAPI from '../../api/machineAPI';
import useUserAPI from '../../api/userAPI';
import useMaintenancePointAPI from '../../api/maintenancePointAPI';
import { formatDate } from '../../utils/dateUtils';
import { getStatusBadgeColor, getStatusLabel } from '../../utils/formatUtils';
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
      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(status)}`}>
        {getStatusLabel(status)}
      </span>
    ),
  },
];

export const Interventions = () => {
  useDocumentTitle('Interventions');
  const navigate      = useNavigate();
  const { keycloak } = useKeycloak();
  const roles        = keycloak.tokenParsed?.realm_access?.roles || [];
  const isAdmin      = roles.includes('admin');
  const isTechnicien = roles.includes('technicien');

  const interventionAPI    = useInterventionAPI();
  const machineAPI         = useMachineAPI();
  const userAPI            = useUserAPI();
  const maintenancePointAPI = useMaintenancePointAPI();

  const [interventions, setInterventions]             = useState([]);
  const [machines, setMachines]                       = useState([]);
  const [technicians, setTechnicians]                 = useState([]);
  const [maintenancePoints, setMaintenancePoints]     = useState([]);
  const [loading, setLoading]                         = useState(false);
  const [error, setError]                             = useState(null);
  const [success, setSuccess]                         = useState(null);
  const [statusFilter, setStatusFilter]               = useState('');
  const [isModalOpen, setIsModalOpen]                 = useState(false);
  const [editingIntervention, setEditingIntervention] = useState(null);
  const [currentPage, setCurrentPage]                 = useState(0);
  const [totalPages, setTotalPages]                   = useState(0);
  const [formData, setFormData] = useState({
    machineId: null, technicianId: null, maintenancePointId: null,
    plannedDate: '', plannedTime: '', actualDate: '', actualTime: '',
    durationMinutes: 0, status: 'PLANIFIEE', observations: '',
    equipmentState: 'NORMAL', cost: '',
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

  const loadMachines    = async () => { try { const r = await machineAPI.getAllMachines(); setMachines(r.data || []); } catch (err) { console.error(err); } };
  const loadTechnicians = async () => { try { const r = await userAPI.getTechnicians();   setTechnicians(r.data || []); } catch (err) { console.error(err); } };

  const loadMaintenancePoints = async (machineId) => {
    if (!machineId) { setMaintenancePoints([]); return; }
    try {
      const r = await maintenancePointAPI.getPointsByMachine(machineId);
      setMaintenancePoints(r.data || []);
    } catch (err) {
      setMaintenancePoints([]);
    }
  };

  const handleOpenModal = (intervention = null) => {
    if (intervention) {
      setEditingIntervention(intervention);
      const mid = intervention.machineId ? Number(intervention.machineId) : null;
      setFormData({
        machineId: mid,
        technicianId: intervention.technicianId ? Number(intervention.technicianId) : null,
        maintenancePointId: intervention.maintenancePointId ? Number(intervention.maintenancePointId) : null,
        plannedDate: intervention.plannedDate || '', plannedTime: intervention.plannedTime || '',
        actualDate: intervention.actualDate || '', actualTime: intervention.actualTime || '',
        durationMinutes: intervention.durationMinutes || 0, status: intervention.status || 'PLANIFIEE',
        observations: intervention.observations || '', equipmentState: intervention.equipmentState || 'NORMAL',
        cost: intervention.cost ?? '',
      });
      loadMaintenancePoints(mid);
    } else {
      setEditingIntervention(null);
      const mid = machines[0] ? Number(machines[0].id) : null;
      setFormData({
        machineId: mid, technicianId: technicians[0] ? Number(technicians[0].id) : null,
        maintenancePointId: null, plannedDate: '', plannedTime: '',
        actualDate: '', actualTime: '', durationMinutes: 0,
        status: 'PLANIFIEE', observations: '', equipmentState: 'NORMAL', cost: '',
      });
      loadMaintenancePoints(mid);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setEditingIntervention(null); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const idFields      = ['machineId', 'technicianId', 'maintenancePointId'];
    const numericFields = ['durationMinutes', 'cost'];
    const parsed = idFields.includes(name)
      ? (value === '' ? null : Number(value))
      : numericFields.includes(name)
        ? (value === '' ? '' : parseFloat(value) || 0)
        : value;
    setFormData(prev => ({ ...prev, [name]: parsed }));
    if (name === 'machineId') {
      setFormData(prev => ({ ...prev, machineId: parsed, maintenancePointId: null }));
      loadMaintenancePoints(parsed);
    }
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
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interventions de Maintenance</h1>
          <p className="text-gray-600 mt-2">Suivez et gérez toutes les interventions</p>
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

      <InterventionsToolbar statusFilter={statusFilter} onStatusFilterChange={(e) => setStatusFilter(e.target.value)} onReset={() => setStatusFilter('')} onNew={() => handleOpenModal()} isAdmin={isAdmin} />

      <Card>
        <Table columns={COLUMNS} data={displayedInterventions} onEdit={handleOpenModal} onDelete={handleDelete} onRowClick={(inv) => navigate(`/interventions/${inv.id}`)} loading={loading} pagination={{ currentPage, totalPages }} onPageChange={setCurrentPage} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingIntervention ? 'Éditer Intervention' : 'Nouvelle Intervention'} size="xl">
        <InterventionForm formData={formData} machines={machines} technicians={technicians} maintenancePoints={maintenancePoints} editingIntervention={editingIntervention} onChange={handleInputChange} onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};
