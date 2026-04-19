import { FiFileText, FiDownload } from 'react-icons/fi';
import { Modal } from '../../../components/Modal';
import { Alert } from '../../../components/Alert';
import { Select } from '../../../components/Form';

const TITLES = {
  monthly:    'Interventions Mensuelles',
  machine:    'Historique Machine',
  technician: 'Activité Technicien',
};

export const ReportParamModal = ({
  modalType, onClose,
  yearMonth, onYearMonthChange,
  machineId, onMachineIdChange, machineOptions,
  techId, onTechIdChange, technicianOptions,
  onDownload, loading, error, onErrorClose,
}) => (
  <Modal isOpen={!!modalType} onClose={onClose} title={TITLES[modalType] || 'Rapport'} size="sm">
    <div className="space-y-4">
      {error && <Alert type="error" message={error} onClose={onErrorClose} />}

      {modalType === 'monthly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mois</label>
          <input
            type="month"
            value={yearMonth}
            onChange={(e) => onYearMonthChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {modalType === 'machine' && (
        machineOptions.length > 0 ? (
          <Select label="Machine" value={machineId} onChange={(e) => onMachineIdChange(e.target.value)} options={machineOptions} placeholder="Sélectionner une machine" />
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID de la machine</label>
            <input type="number" value={machineId} onChange={(e) => onMachineIdChange(e.target.value)} placeholder="ex : 42" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )
      )}

      {modalType === 'technician' && (
        technicianOptions.length > 0 ? (
          <Select label="Technicien" value={techId} onChange={(e) => onTechIdChange(e.target.value)} options={technicianOptions} placeholder="Sélectionner un technicien" />
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID du technicien</label>
            <input type="number" value={techId} onChange={(e) => onTechIdChange(e.target.value)} placeholder="ex : 7" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )
      )}

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-3">Choisir le format d'export</p>
        <div className="flex gap-3">
          <button onClick={() => onDownload('pdf')} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <FiFileText size={15} /> PDF
          </button>
          <button onClick={() => onDownload('excel')} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <FiDownload size={15} /> Excel
          </button>
        </div>
      </div>
    </div>
  </Modal>
);
