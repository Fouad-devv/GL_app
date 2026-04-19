import { useState, useEffect } from 'react';
import { FiActivity, FiCalendar, FiCpu, FiUser, FiBarChart2, FiCheckCircle, FiServer } from 'react-icons/fi';
import { Alert } from '../../components/Alert';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import useReportAPI from '../../api/reportAPI.js';
import useMachineAPI from '../../api/machineAPI.js';
import useUserAPI from '../../api/userAPI.js';
import { downloadFile } from '../../utils/formatUtils';
import { DirectReportCard } from './components/DirectReportCard';
import { ParamReportCard } from './components/ParamReportCard';
import { ReportParamModal } from './components/ReportParamModal';

const DIRECT_REPORTS = [
  { type: 'machines',      icon: FiServer,      color: 'blue',   title: 'Liste des Machines',      description: 'Export complet du parc machines avec statuts, marques et localisations.' },
  { type: 'interventions', icon: FiActivity,    color: 'purple', title: 'Liste des Interventions', description: 'Historique complet de toutes les interventions de maintenance.' },
  { type: 'performance',   icon: FiBarChart2,   color: 'green',  title: 'Analyse de Performance',  description: 'Indicateurs clés de performance et taux de disponibilité des machines.' },
  { type: 'compliance',    icon: FiCheckCircle, color: 'teal',   title: 'Rapport de Conformité',   description: 'Taux de conformité et respect des délais pour toutes les interventions.' },
];

const PARAM_REPORTS = [
  { type: 'monthly',    icon: FiCalendar, color: 'orange', title: 'Interventions Mensuelles', description: "Toutes les interventions d'un mois sélectionné."        },
  { type: 'machine',    icon: FiCpu,      color: 'red',    title: 'Historique Machine',       description: "Toutes les interventions d'une machine sélectionnée." },
  { type: 'technician', icon: FiUser,     color: 'indigo', title: 'Activité Technicien',      description: "Bilan complet des interventions d'un technicien."      },
];

export const Reports = () => {
  const reportAPI  = useReportAPI();
  const machineAPI = useMachineAPI();
  const userAPI    = useUserAPI();

  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(null);
  const [modalType, setModalType] = useState(null);
  const [yearMonth, setYearMonth] = useState('');
  const [machineId, setMachineId] = useState('');
  const [techId, setTechId]       = useState('');
  const [machines, setMachines]   = useState([]);
  const [technicians, setTechs]   = useState([]);

  useEffect(() => { loadDropdowns(); }, []);

  const loadDropdowns = async () => {
    try {
      const [mRes, tRes] = await Promise.all([machineAPI.getAllMachines(), userAPI.getTechnicians()]);
      setMachines(mRes.data.content || mRes.data || []);
      setTechs(tRes.data.content || tRes.data || []);
    } catch { /* silently ignore */ }
  };

  const download = async (apiFn, baseName, format) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFn();
      downloadFile(res, `${baseName}_${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      setSuccess('Rapport téléchargé avec succès');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la génération du rapport');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectReport = (type, format) => {
    const apiMap = {
      machines:      () => reportAPI.getMachinesReport(format),
      interventions: () => reportAPI.getInterventionsReport(format),
      performance:   () => reportAPI.getPerformanceAnalysis(format),
      compliance:    () => reportAPI.getComplianceReport(format),
    };
    download(apiMap[type], `rapport_${type}`, format);
  };

  const handleParamReport = async (format) => {
    let apiFn, baseName;
    if (modalType === 'monthly') {
      if (!yearMonth) { setError('Veuillez sélectionner un mois'); return; }
      apiFn = () => reportAPI.getMonthlyInterventions(yearMonth, format);
      baseName = `interventions_${yearMonth}`;
    } else if (modalType === 'machine') {
      if (!machineId) { setError('Veuillez sélectionner une machine'); return; }
      apiFn = () => reportAPI.getMachineHistory(machineId, format);
      baseName = `historique_machine_${machineId}`;
    } else if (modalType === 'technician') {
      if (!techId) { setError('Veuillez sélectionner un technicien'); return; }
      apiFn = () => reportAPI.getTechnicianActivity(techId, format);
      baseName = `activite_technicien_${techId}`;
    }
    await download(apiFn, baseName, format);
    setModalType(null);
  };

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0 max-w-7xl mx-auto">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
        <p className="text-sm text-gray-500 mt-1">Générez et exportez vos rapports au format PDF ou Excel</p>
      </div>

      {error   && <Alert type="error"   message={error}   onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} duration={3000} />}
      <LoadingOverlay visible={loading} />

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Rapports standards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {DIRECT_REPORTS.map((r) => <DirectReportCard key={r.type} report={r} onDownload={handleDirectReport} loading={loading} />)}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Rapports personnalisés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PARAM_REPORTS.map((r) => <ParamReportCard key={r.type} report={r} onOpen={() => { setError(null); setModalType(r.type); }} loading={loading} />)}
        </div>
      </div>

      <ReportParamModal
        modalType={modalType}
        onClose={() => { setModalType(null); setError(null); }}
        yearMonth={yearMonth}   onYearMonthChange={setYearMonth}
        machineId={machineId}   onMachineIdChange={setMachineId}   machineOptions={machines.map((m) => ({ value: m.id, label: `#${m.id} – ${m.name}` }))}
        techId={techId}         onTechIdChange={setTechId}         technicianOptions={technicians.map((t) => ({ value: t.id, label: t.fullName }))}
        onDownload={handleParamReport}
        loading={loading} error={error} onErrorClose={() => setError(null)}
      />
    </div>
  );
};
