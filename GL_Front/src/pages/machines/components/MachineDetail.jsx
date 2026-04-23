import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiEdit2, FiMapPin, FiClock, FiTool,
  FiCalendar, FiActivity, FiChevronDown, FiChevronRight,
  FiUser, FiPackage, FiAlertCircle,
} from 'react-icons/fi';
import { formatDate } from '../../../utils/dateUtils';
import useMachineAPI from '../../../api/machineAPI';
import useMaintenancePointAPI from '../../../api/maintenancePointAPI';
import useInterventionAPI from '../../../api/interventionAPI';
import { LoadingOverlay } from '../../../components/LoadingSpinner';
import { Alert } from '../../../components/Alert';

/* ── theme maps ─────────────────────────────────────────────────── */
const MACHINE_STATUS_THEME = {
  EN_SERVICE:     { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', label: 'En service'     },
  EN_MAINTENANCE: { bg: '#fefce8', border: '#fde68a', text: '#b45309', label: 'En maintenance'  },
  HORS_SERVICE:   { bg: '#f9fafb', border: '#e5e7eb', text: '#374151', label: 'Hors service'    },
  EN_REPARATION:  { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', label: 'En réparation'   },
};

const OP_THEME = {
  GRAISSAGE:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  INSPECTION:   { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  REMPLACEMENT: { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
  NETTOYAGE:    { bg: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce' },
  REGLAGE:      { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
  REPARATION:   { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
};

const INT_STATUS_THEME = {
  PLANIFIEE: { bg: '#eff6ff', text: '#1d4ed8', label: 'Planifiée' },
  EN_COURS:  { bg: '#fefce8', text: '#b45309', label: 'En cours'  },
  TERMINEE:  { bg: '#f0fdf4', text: '#15803d', label: 'Terminée'  },
  ANNULEE:   { bg: '#fef2f2', text: '#b91c1c', label: 'Annulée'   },
};

const FREQ_LABELS = {
  QUOTIDIENNE: 'Quotidienne', HEBDOMADAIRE: 'Hebdomadaire',
  MENSUELLE: 'Mensuelle', TRIMESTRIELLE: 'Trimestrielle',
  SEMESTRIELLE: 'Semestrielle', ANNUELLE: 'Annuelle',
};

/* ── small reusable pieces ──────────────────────────────────────── */
const InfoRow = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0 gap-4">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: color + '20' }}>
      <Icon className="text-lg" style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
    </div>
  </div>
);

/* ── intervention row inside a point card ───────────────────────── */
const InterventionRow = ({ inv, onClick }) => {
  const s = INT_STATUS_THEME[inv.status] ?? { bg: '#f9fafb', text: '#374151', label: inv.status };
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: s.bg, color: s.text }}>
          {s.label}
        </span>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 min-w-0">
          {inv.plannedDate && (
            <span className="flex items-center gap-1"><FiCalendar className="shrink-0" />{formatDate(inv.plannedDate)}</span>
          )}
          {inv.technicianName && (
            <span className="flex items-center gap-1"><FiUser className="shrink-0" />{inv.technicianName}</span>
          )}
          {inv.durationMinutes != null && (
            <span className="flex items-center gap-1"><FiClock className="shrink-0" />{inv.durationMinutes} min</span>
          )}
          {inv.cost != null && (
            <span className="flex items-center gap-1 font-medium text-gray-600">
              {Number(inv.cost).toLocaleString('fr-MA')} MAD
            </span>
          )}
        </div>
      </div>
      <FiChevronRight className="text-gray-300 shrink-0" />
    </div>
  );
};

/* ── maintenance point card (collapsible) ───────────────────────── */
const PointCard = ({ point, interventions, onNavigateIntervention }) => {
  const [open, setOpen] = useState(false);
  const theme = OP_THEME[point.operationType] ?? { bg: '#f9fafb', border: '#e5e7eb', text: '#374151' };
  const isOverdue = point.nextDue && new Date(point.nextDue) < new Date();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
            <FiTool style={{ color: theme.text }} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                {point.name || point.operationType}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: theme.bg, color: theme.text }}>
                {point.operationType}
              </span>
              {isOverdue && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                  <FiAlertCircle className="text-xs" /> En retard
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-400">
              {point.location && <span className="flex items-center gap-1"><FiMapPin className="shrink-0" />{point.location}</span>}
              {point.frequency && <span className="flex items-center gap-1"><FiClock className="shrink-0" />{FREQ_LABELS[point.frequency] ?? point.frequency}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {interventions.length} intervention{interventions.length !== 1 ? 's' : ''}
          </span>
          {open ? <FiChevronDown className="text-gray-400" /> : <FiChevronRight className="text-gray-400" />}
        </div>
      </button>

      {/* interventions */}
      {open && (
        <div className="border-t border-gray-100">
          {interventions.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400 text-center">Aucune intervention pour ce point</p>
          ) : (
            interventions.map((inv) => (
              <InterventionRow
                key={inv.id}
                inv={inv}
                onClick={() => onNavigateIntervention(inv.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

/* ── main page ──────────────────────────────────────────────────── */
export const MachineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const machineAPI          = useMachineAPI();
  const maintenancePointAPI = useMaintenancePointAPI();
  const interventionAPI     = useInterventionAPI();

  const [machine, setMachine]             = useState(null);
  const [points, setPoints]               = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [machRes, pointsRes, intRes] = await Promise.all([
          machineAPI.getMachineById(id),
          maintenancePointAPI.getPointsByMachine(id),
          interventionAPI.getInterventionsByMachine(id),
        ]);
        setMachine(machRes.data);
        setPoints(pointsRes.data || []);
        setInterventions(intRes.data || []);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les données de cette machine');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="p-6 mt-15 md:mt-0"><LoadingOverlay visible /></div>;

  if (error || !machine) return (
    <div className="p-6 mt-15 md:mt-0">
      <Alert type="error" message={error || 'Machine introuvable'} />
      <button onClick={() => navigate('/machines')} className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <FiArrowLeft /> Retour à la liste
      </button>
    </div>
  );

  const theme = MACHINE_STATUS_THEME[machine.status] ?? { bg: '#f9fafb', border: '#e5e7eb', text: '#374151', label: machine.status };

  const interventionsByPoint = (pointId) =>
    interventions.filter((i) => i.maintenancePointId === pointId);

  const terminées  = interventions.filter((i) => i.status === 'TERMINEE').length;
  const enCours    = interventions.filter((i) => i.status === 'EN_COURS').length;
  const planifiées = interventions.filter((i) => i.status === 'PLANIFIEE').length;

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0 max-w-6xl mx-auto">

      {/* back */}
      <button
        onClick={() => navigate('/machines')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <FiArrowLeft /> Retour aux machines
      </button>

      {/* ── header card ── */}
      <div className="rounded-2xl border px-6 py-5 mb-6" style={{ background: theme.bg, borderColor: theme.border }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'white', color: theme.text, border: `1px solid ${theme.border}` }}
              >
                {theme.label}
              </span>
              {machine.type && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/70 text-gray-600 border border-gray-200">
                  {machine.type}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{machine.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {[machine.brand, machine.model].filter(Boolean).join(' · ')}
              {machine.location && <span className="ml-2 flex-inline items-center"><FiMapPin className="inline mr-1" />{machine.location}</span>}
            </p>
          </div>
          <button
            onClick={() => navigate('/machines')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors shrink-0"
            style={{ background: theme.text }}
          >
            <FiEdit2 /> Modifier
          </button>
        </div>
      </div>

      {/* ── stats row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FiTool}     label="Points de maintenance" value={points.length}            color="#1d4ed8" />
        <StatCard icon={FiActivity} label="Interventions totales"  value={interventions.length}     color="#7e22ce" />
        <StatCard icon={FiClock}    label="Heures de fonctionnement" value={machine.operatingHours ?? '—'} color="#b45309" />
        <StatCard icon={FiCalendar} label="Terminées"              value={terminées}                color="#15803d" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── left: machine info ── */}
        <div className="lg:col-span-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Fiche machine</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-2 mb-4">
            <InfoRow label="Marque"            value={machine.brand} />
            <InfoRow label="Modèle"            value={machine.model} />
            <InfoRow label="N° de série"       value={machine.serialNumber} />
            <InfoRow label="Année de fab."     value={machine.yearManufactured} />
            <InfoRow label="Mise en service"   value={machine.dateCommissioned ? formatDate(machine.dateCommissioned) : null} />
            <InfoRow label="Localisation"      value={machine.location} />
            <InfoRow label="Heures de marche"  value={machine.operatingHours != null ? `${machine.operatingHours} h` : null} />
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">État des interventions</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-2">
            <InfoRow label="Planifiées"  value={planifiées} />
            <InfoRow label="En cours"    value={enCours} />
            <InfoRow label="Terminées"   value={terminées} />
            <InfoRow label="Annulées"    value={interventions.filter((i) => i.status === 'ANNULEE').length} />
          </div>
        </div>

        {/* ── right: maintenance points + interventions ── */}
        <div className="lg:col-span-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Historique de maintenance ({points.length} point{points.length !== 1 ? 's' : ''})
          </p>

          {points.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-10 text-center text-sm text-gray-400">
              Aucun point de maintenance enregistré pour cette machine
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {points.map((point) => (
                <PointCard
                  key={point.id}
                  point={point}
                  interventions={interventionsByPoint(point.id)}
                  onNavigateIntervention={(invId) => navigate(`/interventions/${invId}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
