import { FiChevronRight } from 'react-icons/fi';

const COLOR_MAP = {
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100' },
  red:    { bg: 'bg-rose-50',   icon: 'text-rose-600',   border: 'border-rose-100'   },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
};

export const ParamReportCard = ({ report, onOpen, loading }) => {
  const c    = COLOR_MAP[report.color] || COLOR_MAP.orange;
  const Icon = report.icon;

  return (
    <div className={`bg-white rounded-xl border ${c.border} p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className={`${c.bg} p-2.5 rounded-lg`}>
          <Icon className={`${c.icon} text-xl`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{report.title}</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{report.description}</p>
        </div>
      </div>
      <div className="pt-1 border-t border-gray-50">
        <button
          onClick={onOpen}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Configurer et télécharger <FiChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};
