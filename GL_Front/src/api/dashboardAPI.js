// dashboardAPI.js
import useAxiosPrivate from "./useAxiosPrivate";


const useDashboardAPI = () => {
  const axiosPrivate = useAxiosPrivate();

  return {
    // Get KPI statistics
    getKPIs: () =>
      axiosPrivate.get("/api/dashboard/kpis"),

    // Get implementation rate
    getImplementationRate: () =>
      axiosPrivate.get("/api/dashboard/implementation-rate"),

    // Get prevented failures count
    getPreventedFailures: () =>
      axiosPrivate.get("/api/dashboard/prevented-failures"),

    // Get average intervention time
    getAverageInterventionTime: () =>
      axiosPrivate.get("/api/dashboard/avg-intervention-time"),

    // Get machine availability rates
    getMachineAvailability: () =>
      axiosPrivate.get("/api/dashboard/machine-availability"),

    // Get maintenance costs
    getMaintenanceCosts: (startDate, endDate) =>
      axiosPrivate.get("/api/dashboard/maintenance-costs", { params: { startDate, endDate } }),

    // Get recent interventions
    getRecentInterventions: (limit = 10) =>
      axiosPrivate.get("/api/dashboard/recent-interventions", { params: { limit } }),

    // Get overdue interventions
    getOverdueInterventions: () =>
      axiosPrivate.get("/api/dashboard/overdue-interventions"),

    // Get upcoming interventions
    getUpcomingInterventions: (days = 7) =>
      axiosPrivate.get("/api/dashboard/upcoming-interventions", { params: { days } }),

    // Get current alerts
    getAlerts: () =>
      axiosPrivate.get("/api/dashboard/alerts"),

    // Get machine statistics
    getMachineStats: () =>
      axiosPrivate.get("/api/dashboard/machine-stats"),

    // Get intervention statistics by type
    getInterventionStats: () =>
      axiosPrivate.get("/api/dashboard/intervention-stats")
  };
};

export default useDashboardAPI;