// useInterventionAPI.js
import useAxiosPrivate from './useAxiosPrivate';

const useInterventionAPI = () => {
  const axiosPrivate = useAxiosPrivate();

  return {
    getAllInterventions: (page = 0, size = 10) =>
      axiosPrivate.get('/api/interventions', { params: { page, size } }),

    getInterventionById: (interventionId) =>
      axiosPrivate.get(`/api/interventions/${interventionId}`),

    createIntervention: (interventionData) =>
      axiosPrivate.post('/api/interventions', interventionData),

    updateIntervention: (interventionId, interventionData) =>
      axiosPrivate.put(`/api/interventions/${interventionId}`, interventionData),

    deleteIntervention: (interventionId) =>
      axiosPrivate.delete(`/api/interventions/${interventionId}`),

    getInterventionsByStatus: (status) =>
      axiosPrivate.get(`/api/interventions/status/${status}`),

    getInterventionsByMachine: (machineId) =>
      axiosPrivate.get(`/api/machines/${machineId}/interventions`),

    getInterventionsByTechnician: (technicianId) =>
      axiosPrivate.get(`/api/interventions/technician/${technicianId}`),

    getPlannedInterventions: () =>
      axiosPrivate.get('/api/interventions/planned'),

    getDelayedInterventions: () =>
      axiosPrivate.get('/api/interventions/delayed'),

    updateStatus: (interventionId, status) =>
      axiosPrivate.patch(`/api/interventions/${interventionId}/status/${status}`),

    assignTechnician: (interventionId, technicianId) =>
      axiosPrivate.patch(`/api/interventions/${interventionId}/assign-technician/${technicianId}`),
  };
};

export default useInterventionAPI;