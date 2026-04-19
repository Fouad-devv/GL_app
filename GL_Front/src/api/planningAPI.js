// usePlanningAPI.js
import useAxiosPrivate from './useAxiosPrivate';

const usePlanningAPI = () => {
  const axiosPrivate = useAxiosPrivate();

  return {
    getPlannedInterventions: (startDate, endDate) =>
      axiosPrivate.get('/api/planning/interventions', { params: { startDate, endDate } }),

    getMonthPlanning: (year, month) =>
      axiosPrivate.get(`/api/planning/month/${year}/${month}`),

    getWeekPlanning: (year, week) =>
      axiosPrivate.get(`/api/planning/week/${year}/${week}`),

    getDayPlanning: (date) =>
      axiosPrivate.get(`/api/planning/day/${date}`),

    getTechnicianPlanning: (technicianId, startDate, endDate) =>
      axiosPrivate.get(`/api/planning/technician/${technicianId}`, { params: { startDate, endDate } }),

    generatePlanning: (startDate, endDate) =>
      axiosPrivate.post('/api/planning/generate', { startDate, endDate }),

    rescheduleIntervention: (interventionId, newDate) =>
      axiosPrivate.patch(`/api/planning/reschedule/${interventionId}`, { newDate }),

    cancelIntervention: (interventionId, reason) =>
      axiosPrivate.patch(`/api/planning/cancel/${interventionId}`, { reason }),

    assignTechnicianToIntervention: (interventionId, technicianId) =>
      axiosPrivate.patch(`/api/planning/assign/${interventionId}`, { technicianId }),

    getTechnicianAvailability: (technicianId, date) =>
      axiosPrivate.get(`/api/planning/technician-availability/${technicianId}`, { params: { date } }),

    getTechniciansAvailabilityForDate: (date) =>
      axiosPrivate.get(`/api/planning/availability/${date}`),

    getInterventionAlerts: () =>
      axiosPrivate.get('/api/planning/alerts'),
  };
};

export default usePlanningAPI;