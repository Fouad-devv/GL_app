// useMaintenancePointAPI.js
import useAxiosPrivate from './useAxiosPrivate';

const useMaintenancePointAPI = () => {
  const axiosPrivate = useAxiosPrivate();

  return {
    getAllPoints: (page = 0, size = 10) =>
      axiosPrivate.get('/api/maintenance-points', { params: { page, size } }),

    getPointById: (pointId) =>
      axiosPrivate.get(`/api/maintenance-points/${pointId}`),

    getPointsByMachine: (machineId) =>
      axiosPrivate.get(`/api/machines/${machineId}/maintenance-points`),

    createPoint: (pointData) =>
      axiosPrivate.post('/api/maintenance-points', pointData),

    updatePoint: (pointId, pointData) =>
      axiosPrivate.put(`/api/maintenance-points/${pointId}`, pointData),

    deletePoint: (pointId) =>
      axiosPrivate.delete(`/api/maintenance-points/${pointId}`),

    getPointsByType: (type) =>
      axiosPrivate.get(`/api/maintenance-points/type/${type}`),

    getUpcomingPoints: () =>
      axiosPrivate.get('/api/maintenance-points/upcoming'),
  };
};

export default useMaintenancePointAPI;