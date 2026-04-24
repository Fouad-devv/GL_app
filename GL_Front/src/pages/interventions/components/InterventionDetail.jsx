import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiEdit2, FiCalendar, FiClock, FiUser,
  FiTool, FiDollarSign, FiFileText, FiActivity,
  FiUpload, FiTrash2, FiX, FiImage, FiChevronLeft, FiChevronRight, FiZoomIn,
} from 'react-icons/fi';
import { formatDate } from '../../../utils/dateUtils';
import useInterventionAPI from '../../../api/interventionAPI';
import useMaintenancePointAPI from '../../../api/maintenancePointAPI';
import { LoadingOverlay } from '../../../components/LoadingSpinner';
import { Alert } from '../../../components/Alert';

const STATUS_THEME = {
  PLANIFIEE: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', label: 'Planifiée'  },
  EN_COURS:  { bg: '#fefce8', border: '#fde68a', text: '#b45309', label: 'En cours'   },
  TERMINEE:  { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', label: 'Terminée'   },
  ANNULEE:   { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', label: 'Annulée'    },
  EN_RETARD: { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', label: 'En retard'  },
};

const Field = ({ icon: Icon, label, value, accent }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-content-center flex-shrink-0 flex items-center justify-center">
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

/* ── Photo section ─────────────────────────────────────────────────────── */
const PhotoSection = ({ interventionId }) => {
  const interventionAPI = useInterventionAPI();

  const [photos, setPhotos]         = useState([]);
  const [blobUrls, setBlobUrls]     = useState({});
  const [uploading, setUploading]   = useState(false);
  const [lightbox, setLightbox]     = useState(null); // index into photos array
  const [confirmDel, setConfirmDel] = useState(null); // photo id to delete
  const [error, setError]           = useState(null);

  const fileInputRef = useRef();

  /* Load photo list then fetch each blob */
  const loadPhotos = useCallback(async () => {
    try {
      const res = await interventionAPI.getPhotos(interventionId);
      const list = res.data || [];
      setPhotos(list);

      // Fetch blobs for each photo
      const urlMap = {};
      await Promise.all(list.map(async (p) => {
        try {
          const blobRes = await interventionAPI.getPhotoData(p.id);
          urlMap[p.id] = URL.createObjectURL(blobRes.data);
        } catch {
          urlMap[p.id] = null;
        }
      }));
      setBlobUrls(urlMap);
    } catch {
      /* silently ignore — photos are optional */
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interventionId]);

  useEffect(() => {
    loadPhotos();
    return () => {
      // Revoke object URLs on unmount to free memory
      Object.values(blobUrls).forEach((u) => u && URL.revokeObjectURL(u));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPhotos]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    if (!file.type.startsWith('image/')) {
      setError('Seules les images sont acceptées.');
      return;
    }
    try {
      setUploading(true);
      setError(null);
      await interventionAPI.uploadPhoto(interventionId, file);
      await loadPhotos();
    } catch {
      setError("Erreur lors de l'envoi de la photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await interventionAPI.deletePhoto(photoId);
      URL.revokeObjectURL(blobUrls[photoId]);
      setBlobUrls((prev) => { const n = { ...prev }; delete n[photoId]; return n; });
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      if (lightbox !== null) setLightbox(null);
    } catch {
      setError('Erreur lors de la suppression.');
    } finally {
      setConfirmDel(null);
    }
  };

  const moveLightbox = (dir) =>
    setLightbox((i) => (i + dir + photos.length) % photos.length);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Photos ({photos.length})
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition disabled:opacity-50"
        >
          <FiUpload size={13} /> Importer une photo
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-3" />
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
          <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          Envoi en cours…
        </div>
      )}

      {photos.length === 0 && !uploading ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-10 flex flex-col items-center gap-2 text-gray-400">
          <FiImage size={32} className="text-gray-300" />
          <p className="text-sm">Aucune photo — importez une image</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 aspect-square cursor-zoom-in"
              onClick={() => setLightbox(idx)}
            >
              {blobUrls[photo.id] ? (
                <img
                  src={blobUrls[photo.id]}
                  alt={photo.fileName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiImage className="text-gray-300" size={28} />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDel(photo.id); }}
                    className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition"
                  >
                    <FiTrash2 size={12} className="text-white" />
                  </button>
                </div>
                <FiZoomIn size={28} className="text-white drop-shadow-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && photos[lightbox] && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.93)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
          >
            <FiX size={20} />
          </button>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); moveLightbox(-1); }}
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
            >
              <FiChevronLeft size={24} />
            </button>
          )}

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); moveLightbox(1); }}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
            >
              <FiChevronRight size={24} />
            </button>
          )}

          {/* Image */}
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '0 72px', maxWidth: '100vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            {blobUrls[photos[lightbox].id] && (
              <img
                src={blobUrls[photos[lightbox].id]}
                alt={photos[lightbox].fileName}
                style={{ maxHeight: '82vh', maxWidth: '90vw', borderRadius: 12, objectFit: 'contain', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{photos[lightbox].fileName}</span>
              <button
                onClick={() => setConfirmDel(photos[lightbox].id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#fff', background: 'rgba(239,68,68,0.8)', border: 'none', borderRadius: 8, cursor: 'pointer' }}
              >
                <FiTrash2 size={12} /> Supprimer
              </button>
            </div>
            {photos.length > 1 && (
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{lightbox + 1} / {photos.length}</span>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {confirmDel !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900 mb-2">Supprimer la photo ?</h3>
            <p className="text-sm text-gray-500 mb-5">Cette action est irréversible.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDel(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDel)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Main component ────────────────────────────────────────────────────── */
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

      {/* Photos */}
      <PhotoSection interventionId={id} />

    </div>
  );
};
