import useAxiosPrivate from "./useAxiosPrivate";

const useDashboardAPI = () => {
  const axiosPrivate = useAxiosPrivate();

  return {
    getKPIs: () =>
      axiosPrivate.get("/api/dashboard/kpis"),

    getInterventionStats: () =>
      axiosPrivate.get("/api/dashboard/intervention-stats"),

    getAlerts: () =>
      axiosPrivate.get("/api/dashboard/alerts"),

    getUpcomingInterventions: (days = 7) =>
      axiosPrivate.get("/api/dashboard/upcoming-interventions", { params: { days } }),

    getMachineTotal: () =>
      axiosPrivate.get("/api/dashboard/machines/total"),

    getMachineOperational: () =>
      axiosPrivate.get("/api/dashboard/machines/operational"),

    getMachineMaintenance: () =>
      axiosPrivate.get("/api/dashboard/machines/maintenance"),

    getMachineRepair: () =>
      axiosPrivate.get("/api/dashboard/machines/repair"),

    getMachineOutOfService: () =>
      axiosPrivate.get("/api/dashboard/machines/outofservice"),
  };
};

export default useDashboardAPI;
