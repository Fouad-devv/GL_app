import { FiFileText, FiDownload } from 'react-icons/fi';
import { FmtBtn } from './FmtBtn';

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-50',    icon: 'text-blue-600',    border: 'border-blue-100'    },
  purple: { bg: 'bg-purple-50',  icon: 'text-purple-600',  border: 'border-purple-100'  },
  green:  { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
  teal:   { bg: 'bg-teal-50',    icon: 'text-teal-600',    border: 'border-teal-100'    },
};

export const DirectReportCard = ({ report, onDownload, loading }) => {
  const c    = COLOR_MAP[report.color] || COLOR_MAP.blue;
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
      <div className="flex gap-2 pt-1 border-t border-gray-50">
        <FmtBtn label="PDF"   icon={<FiFileText size={12} />} variant="pdf"   disabled={loading} onClick={() => onDownload(report.type, 'pdf')}   />
        <FmtBtn label="Excel" icon={<FiDownload size={12} />} variant="excel" disabled={loading} onClick={() => onDownload(report.type, 'excel')} />
      </div>
    </div>
  );
};
