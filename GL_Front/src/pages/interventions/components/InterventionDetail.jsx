import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiEdit2, FiCalendar, FiClock, FiUser,
  FiTool, FiDollarSign, FiFileText, FiActivity,
} from 'react-icons/fi';
import { formatDate } from '../../../utils/dateUtils';
import useInterventionAPI from '../../../api/interventionAPI';
import useMaintenancePointAPI from '../../../api/maintenancePointAPI';
import { LoadingOverlay } from '../../../components/LoadingSpinner';
import { Alert } from '../../../components/Alert';

const STATUS_THEME = {
  PLANIFIEE: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', label: 'Planifiée' },
  EN_COURS:  { bg: '#fefce8', border: '#fde68a', text: '#b45309', label: 'En cours'  },
  TERMINEE:  { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', label: 'Terminée'  },
  ANNULEE:   { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', label: 'Annulée'   },
};

const Field = ({ icon: Icon, label, value, accent }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon className="text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5" style={accent ? { color: accent } : {}}>
          {value}
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-6">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{title}</p>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4">
      {children}
    </div>
  </div>
);

export const InterventionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const interventionAPI    = useInterventionAPI();
  const maintenancePointAPI = useMaintenancePointAPI();

  const [intervention, setIntervention] = useState(null);
  const [maintenancePoint, setMaintenancePoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await interventionAPI.getInterventionById(id);
        const inv = res.data;
        setIntervention(inv);
        if (inv.maintenancePointId) {
          const mpRes = await maintenancePointAPI.getPointById(inv.maintenancePointId);
          setMaintenancePoint(mpRes.data);
        }
      } catch (err) {
        console.error(err);
        setError('Impossible de charger cette intervention');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="p-6 mt-15 md:mt-0"><LoadingOverlay visible /></div>;

  if (error || !intervention) return (
    <div className="p-6 mt-15 md:mt-0">
      <Alert type="error" message={error || 'Intervention introuvable'} />
      <button onClick={() => navigate('/interventions')} className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <FiArrowLeft /> Retour à la liste
      </button>
    </div>
  );

  const theme = STATUS_THEME[intervention.status] ?? { bg: '#f9fafb', border: '#e5e7eb', text: '#374151', label: intervention.status };

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0 max-w-5xl mx-auto">

      {/* Back button */}
      <button
        onClick={() => navigate('/interventions')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <FiArrowLeft /> Retour aux interventions
      </button>

      {/* Header card */}
      <div className="rounded-2xl border px-6 py-5 mb-6" style={{ background: theme.bg, borderColor: theme.border }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'white', color: theme.text, border: `1px solid ${theme.border}` }}
              >
                {theme.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Intervention #{intervention.id}
            </h1>
            {intervention.machineName && (
              <p className="text-sm text-gray-500 mt-1">
                Machine : <span className="font-semibold text-gray-700">{intervention.machineName}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/interventions')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ background: theme.text }}
          >
            <FiEdit2 /> Modifier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left column */}
        <div>
          <Section title="Planification">
            <Field icon={FiCalendar} label="Date planifiée"  value={intervention.plannedDate ? formatDate(intervention.plannedDate) : null} />
            <Field icon={FiClock}    label="Heure planifiée" value={intervention.plannedTime ?? null} />
            <Field icon={FiCalendar} label="Date réelle"     value={intervention.actualDate  ? formatDate(intervention.actualDate)  : null} />
            <Field icon={FiClock}    label="Heure réelle"    value={intervention.actualTime  ?? null} />
            <Field icon={FiClock}    label="Durée"           value={intervention.durationMinutes != null ? `${intervention.durationMinutes} min` : null} />
          </Section>

          <Section title="Coût">
            <Field
              icon={FiDollarSign}
              label="Coût"
              value={intervention.cost != null ? `${Number(intervention.cost).toLocaleString('fr-MA')} MAD` : null}
            />
          </Section>
        </div>

        {/* Right column */}
        <div>
          <Section title="Affectation">
            <Field icon={FiUser}   label="Technicien"        value={intervention.technicianName ?? null} />
            <Field
              icon={FiTool}
              label="Point de maintenance"
              value={maintenancePoint
                ? [maintenancePoint.operationType, maintenancePoint.location].filter(Boolean).join(' — ')
                : intervention.maintenancePointId ? `Point #${intervention.maintenancePointId}` : null}
            />
            <Field icon={FiActivity} label="État équipement" value={intervention.equipmentState ?? null} />
          </Section>

          {intervention.observations && (
            <Section title="Observations">
              <p className="py-4 text-sm text-gray-700 leading-relaxed">{intervention.observations}</p>
            </Section>
          )}
        </div>
      </div>

      {/* Dates */}
      <Section title="Historique">
        <Field icon={FiCalendar} label="Créé le"    value={intervention.createdAt ? formatDate(intervention.createdAt) : null} />
        <Field icon={FiCalendar} label="Modifié le" value={intervention.updatedAt ? formatDate(intervention.updatedAt) : null} />
      </Section>

    </div>
  );
};
