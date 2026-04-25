import { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Card } from '../../components/Card';
import { Alert } from '../../components/Alert';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import usePlanningAPI from '../../api/planningAPI.js';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { PlanningStats } from './components/PlanningStats';
import { InterventionDetailModal } from './components/InterventionDetailModal';

export const Planning = () => {
  useDocumentTitle('Planning');
  const planningAPI = usePlanningAPI();

  const [currentDate, setCurrentDate]                   = useState(new Date());
  const [interventions, setInterventions]               = useState([]);
  const [loading, setLoading]                           = useState(false);
  const [error, setError]                               = useState(null);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [isModalOpen, setIsModalOpen]                   = useState(false);

  useEffect(() => {
    loadMonthPlanning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const loadMonthPlanning = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await planningAPI.getMonthPlanning(currentDate.getFullYear(), currentDate.getMonth() + 1);
      setInterventions(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement du planning');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const handleInterventionClick = (intervention) => { setSelectedIntervention(intervention); setIsModalOpen(true); };

  const getInterventionsForDay = (day) =>
    interventions.filter((int) => {
      const d = new Date(int.plannedDate);
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay    = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days        = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const weeks       = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="p-4 md:p-6 mt-15 md:mt-0">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planning de Maintenance</h1>
          <p className="text-gray-600 mt-2">Vue mensuelle des interventions planifiées</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow transition flex-shrink-0 mt-1"
        >
          <FiRefreshCw size={14} /> Actualiser
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <LoadingOverlay visible={loading} />

      <Card>
        <CalendarHeader currentDate={currentDate} onPrev={handlePrevMonth} onNext={handleNextMonth} />
        <CalendarGrid weeks={weeks} getInterventionsForDay={getInterventionsForDay} onInterventionClick={handleInterventionClick} />
      </Card>

      <PlanningStats interventions={interventions} />

      <InterventionDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} intervention={selectedIntervention} />
    </div>
  );
};
