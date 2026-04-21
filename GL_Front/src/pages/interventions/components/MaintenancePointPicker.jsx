import { FiTool, FiMapPin, FiClock, FiAlertCircle } from 'react-icons/fi';

const TYPE_COLORS = {
  GRAISSAGE:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  INSPECTION:   { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  REMPLACEMENT: { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
  NETTOYAGE:    { bg: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce' },
  REGLAGE:      { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
  REPARATION:   { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
};

const FREQ_LABELS = {
  QUOTIDIENNE:   'Quotidien',
  HEBDOMADAIRE:  'Hebdo',
  MENSUELLE:     'Mensuel',
  TRIMESTRIELLE: 'Trimestriel',
  SEMESTRIELLE:  'Semestriel',
  ANNUELLE:      'Annuel',
};

const pointLabel = (p) => {
  if (p.name) return p.name;
  const parts = [p.operationType, p.location].filter(Boolean);
  return parts.length ? parts.join(' — ') : `Point #${p.id}`;
};

export const MaintenancePointPicker = ({ points = [], value, onChange, machineSelected }) => {
  const handleSelect = (id) => {
    onChange({ target: { name: 'maintenancePointId', value: id ?? '' } });
  };

  if (!machineSelected) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Point de maintenance</label>
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm">
          <FiTool className="flex-shrink-0" />
          Sélectionnez d'abord une machine
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Point de maintenance
        {points.length > 0 && (
          <span className="ml-2 text-xs font-normal text-gray-400">{points.length} disponible{points.length > 1 ? 's' : ''}</span>
        )}
      </label>

      <div className="space-y-2">
        {/* None option */}
        <button
          type="button"
          onClick={() => handleSelect(null)}
          className="w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150 flex items-center gap-3"
          style={
            !value
              ? { borderColor: '#6b7280', background: '#f9fafb' }
              : { borderColor: '#e5e7eb', background: '#fff' }
          }
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <FiAlertCircle className="text-gray-500 text-sm" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Aucun — Intervention corrective</p>
            <p className="text-xs text-gray-400">Panne ou urgence non planifiée</p>
          </div>
          {!value && <div className="ml-auto w-2 h-2 rounded-full bg-gray-500 flex-shrink-0" />}
        </button>

        {points.length === 0 ? (
          <div className="px-4 py-3 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 text-center">
            Aucun point de maintenance défini pour cette machine
          </div>
        ) : (
          points.map((p) => {
            const selected = Number(value) === p.id;
            const theme = TYPE_COLORS[p.operationType] ?? { bg: '#f9fafb', border: '#e5e7eb', text: '#374151' };
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id)}
                className="w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150"
                style={
                  selected
                    ? { borderColor: theme.text, background: theme.bg }
                    : { borderColor: '#e5e7eb', background: '#fff' }
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: theme.bg, border: `1px solid ${theme.border}` }}
                  >
                    <FiTool style={{ color: theme.text, fontSize: 13 }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {pointLabel(p)}
                      </span>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: theme.bg, color: theme.text, border: `1px solid ${theme.border}` }}
                      >
                        {p.operationType}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {p.location && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <FiMapPin className="flex-shrink-0" style={{ fontSize: 10 }} />
                          {p.location}
                        </span>
                      )}
                      {p.frequency && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <FiClock className="flex-shrink-0" style={{ fontSize: 10 }} />
                          {FREQ_LABELS[p.frequency] ?? p.frequency}
                        </span>
                      )}
                    </div>

                    {p.description && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{p.description}</p>
                    )}
                  </div>

                  {selected && (
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                      style={{ background: theme.text }}
                    />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
