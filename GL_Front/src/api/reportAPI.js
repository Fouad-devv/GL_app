import useAxiosPrivate from './useAxiosPrivate';

const useReportAPI = () => {
  const axiosPrivate = useAxiosPrivate();
  const blob = { responseType: 'blob' };

  return {
    // ── Core report endpoints — format: 'pdf' | 'excel' | 'csv' ────────────
    getMachinesReport: (format = 'pdf') =>
      axiosPrivate.get('/api/reports/machines/export', { ...blob, params: { format } }),

    getInterventionsReport: (format = 'pdf') =>
      axiosPrivate.get('/api/reports/interventions/export', { ...blob, params: { format } }),

    getMonthlyInterventions: (yearMonth, format = 'pdf') =>
      axiosPrivate.get(`/api/reports/interventions/monthly/${yearMonth}`, { ...blob, params: { format } }),

    getMachineHistory: (machineId, format = 'pdf') =>
      axiosPrivate.get(`/api/reports/machine/${machineId}/history`, { ...blob, params: { format } }),

    getTechnicianActivity: (technicianId, format = 'pdf') =>
      axiosPrivate.get(`/api/reports/technician/${technicianId}/activity`, { ...blob, params: { format } }),

    getPerformanceAnalysis: (format = 'pdf') =>
      axiosPrivate.get('/api/reports/performance', { ...blob, params: { format } }),

    getComplianceReport: (format = 'pdf') =>
      axiosPrivate.get('/api/reports/compliance', { ...blob, params: { format } }),

    // ── Legacy aliases (kept for any other callers) ──────────────────────────
    exportMachines: ()      => axiosPrivate.get('/api/reports/machines/export',      { ...blob, params: { format: 'csv' } }),
    exportInterventions: () => axiosPrivate.get('/api/reports/interventions/export', { ...blob, params: { format: 'csv' } }),
  };
};

export default useReportAPI;
