import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { FiArrowLeft, FiEdit2, FiTool, FiMapPin, FiClock, FiPackage, FiCalendar, FiAlertCircle, FiUser } from 'react-icons/fi';
import { formatDate } from '../../../utils/dateUtils';
import useMaintenancePointAPI from '../../../api/maintenancePointAPI';
import useInterventionAPI from '../../../api/interventionAPI';
import { LoadingOverlay } from '../../../components/LoadingSpinner';
import { Alert } from '../../../components/Alert';

const TYPE_THEME = {
  GRAISSAGE:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  INSPECTION:   { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  REMPLACEMENT: { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
  NETTOYAGE:    { bg: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce' },
  REGLAGE:      { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
  REPARATION:   { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
};

const FREQ_LABELS = {
  QUOTIDIENNE:   'Quotidienne',
  HEBDOMADAIRE:  'Hebdomadaire',
  MENSUELLE:     'Mensuelle',
  TRIMESTRIELLE: 'Trimestrielle',
  SEMESTRIELLE:  'Semestrielle',
  ANNUELLE:      'Annuelle',
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
        <p className="text-sm font-medium text-gray-800 mt-0.5" style={accent ? { color: accent } : {}}>{value}</p>
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

const STATUS_STYLE = {
  PLANIFIEE:  { bg: '#eff6ff', text: '#1d4ed8', label: 'Planifiée' },
  EN_COURS:   { bg: '#fefce8', text: '#b45309', label: 'En cours' },
  TERMINEE:   { bg: '#f0fdf4', text: '#15803d', label: 'Terminée' },
  ANNULEE:    { bg: '#fef2f2', text: '#b91c1c', label: 'Annulée' },
};

export const MaintenancePointDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const maintenanceAPI = useMaintenancePointAPI();
  const interventionAPI = useInterventionAPI();

  const [point, setPoint] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useDocumentTitle(point ? point.name : 'Point de Maintenance');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [pointRes, intRes] = await Promise.all([
          maintenanceAPI.getPointById(id),
          interventionAPI.getInterventionsByMaintenancePoint(id),
        ]);
        setPoint(pointRes.data);
        setInterventions(intRes.data || []);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger ce point de maintenance');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="p-6 mt-15 md:mt-0"><LoadingOverlay visible /></div>;

  if (error || !point) return (
    <div className="p-6 mt-15 md:mt-0">
      <Alert type="error" message={error || 'Point introuvable'} />
      <button onClick={() => navigate('/maintenance')} className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <FiArrowLeft /> Retour à la liste
      </button>
    </div>
  );

  const theme = TYPE_THEME[point.operationType] ?? { bg: '#f9fafb', border: '#e5e7eb', text: '#374151' };
  const isOverdue = point.nextDue && new Date(point.nextDue) < new Date();

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0 max-w-5xl mx-auto">

      {/* Back button */}
      <button
        onClick={() => navigate('/maintenance')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <FiArrowLeft /> Retour aux points de maintenance
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
                {point.operationType}
              </span>
              {isOverdue && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                  <FiAlertCircle /> En retard
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {point.name || [point.operationType, point.location].filter(Boolean).join(' — ') || `Point #${point.id}`}
            </h1>
            {point.machineName && (
              <p className="text-sm text-gray-500 mt-1">
                Machine : <span className="font-semibold text-gray-700">{point.machineName}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/maintenance', { state: { editId: point.id } })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ background: theme.text }}
          >
            <FiEdit2 /> Modifier
          </button>
        </div>
      </div>

      {/* Details section */}
      <Section title="Détails">
        <Field icon={FiMapPin}  label="Localisation"     value={point.location} />
        <Field icon={FiTool}    label="Type d'opération" value={point.operationType} accent={theme.text} />
        <Field icon={FiClock}   label="Fréquence"        value={FREQ_LABELS[point.frequency] ?? point.frequency} />
        <Field icon={FiPackage} label="Consommable"      value={point.consumableType} />
        <Field icon={FiPackage} label="Quantité"         value={point.quantity != null ? `${point.quantity} unité${point.quantity > 1 ? 's' : ''}` : null} />
        <Field icon={FiClock}   label="Durée estimée"    value={point.estimatedDurationMinutes != null ? `${point.estimatedDurationMinutes} min` : null} />
      </Section>

      {/* Description section */}
      {point.description && (
        <Section title="Description">
          <p className="py-4 text-sm text-gray-700 leading-relaxed">{point.description}</p>
        </Section>
      )}

      {/* Planning section */}
      <Section title="Planification">
        <Field
          icon={FiCalendar}
          label="Dernière exécution"
          value={point.lastPerformed ? formatDate(point.lastPerformed) : 'Jamais effectuée'}
        />
        <Field
          icon={FiCalendar}
          label="Prochaine échéance"
          value={point.nextDue ? formatDate(point.nextDue) : '—'}
          accent={isOverdue ? '#b91c1c' : undefined}
        />
        <Field
          icon={FiCalendar}
          label="Créé le"
          value={point.createdAt ? formatDate(point.createdAt) : '—'}
        />
      </Section>

      {/* Interventions section */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Interventions ({interventions.length})
        </p>
        {interventions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-6 text-center text-sm text-gray-400">
            Aucune intervention liée à ce point
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {interventions.map((inv) => {
              const s = STATUS_STYLE[inv.status] ?? { bg: '#f9fafb', text: '#374151', label: inv.status };
              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/interventions`)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      Intervention #{inv.id}
                    </span>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: s.bg, color: s.text }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    {inv.plannedDate && (
                      <span className="flex items-center gap-1">
                        <FiCalendar className="text-gray-400" />
                        {formatDate(inv.plannedDate)}
                      </span>
                    )}
                    {inv.technicianName && (
                      <span className="flex items-center gap-1">
                        <FiUser className="text-gray-400" />
                        {inv.technicianName}
                      </span>
                    )}
                    {inv.durationMinutes != null && (
                      <span className="flex items-center gap-1">
                        <FiClock className="text-gray-400" />
                        {inv.durationMinutes} min
                      </span>
                    )}
                  </div>
                  {inv.observations && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{inv.observations}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
