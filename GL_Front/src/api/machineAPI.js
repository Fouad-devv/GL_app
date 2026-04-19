// useMachineAPI.js
import useAxiosPrivate from './useAxiosPrivate';

const useMachineAPI = () => {
  const axiosPrivate = useAxiosPrivate();

  return {
    getAllMachines: () =>
      axiosPrivate.get('/api/machines'),

    getMachineById: (machineId) =>
      axiosPrivate.get(`/api/machines/${machineId}`),

    createMachine: (machineData) =>
      axiosPrivate.post('/api/machines', machineData),

    updateMachine: (machineId, machineData) =>
      axiosPrivate.put(`/api/machines/${machineId}`, machineData),

    deleteMachine: (machineId) =>
      axiosPrivate.delete(`/api/machines/${machineId}`),

    searchMachines: (query) =>
      axiosPrivate.get('/api/machines/search', { params: { q: query } }),

    getMachinesByStatus: (status) =>
      axiosPrivate.get(`/api/machines/status/${status}`),

  };
};

export default useMachineAPI;