import {
  FiGrid, FiCpu, FiClipboard, FiTool, FiCalendar, FiBarChart2, FiUsers,
} from "react-icons/fi";

export const NAV_SECTIONS = [
  {
    title: "Principal",
    items: [
      { to: "/dashboard",     label: "Tableau de bord",   icon: FiGrid,      roles: [] },
    ],
  },
  {
    title: "Gestion",
    items: [
      { to: "/machines",      label: "Machines",           icon: FiCpu,       roles: [] },
      { to: "/maintenance",   label: "Points Maintenance", icon: FiClipboard, roles: ["admin", "responsable de maintenance", "chef d'equipe"] },
      { to: "/interventions", label: "Interventions",      icon: FiTool,      roles: ["admin", "technicien", "chef d'equipe", "responsable de maintenance"] },
      { to: "/planning",      label: "Planning",           icon: FiCalendar,  roles: [] },
    ],
  },
  {
    title: "Analyse",
    items: [
      { to: "/reports",       label: "Rapports",           icon: FiBarChart2, roles: ["admin", "responsable de maintenance"] },
    ],
  },
  {
    title: "Administration",
    items: [
      { to: "/users",         label: "Utilisateurs",       icon: FiUsers,     roles: ["admin"] },
    ],
  },
];

export const ROLE_STYLES = {
  "admin":                      { badge: "bg-blue-500/20 text-blue-300",    dot: "bg-blue-400"   },
  "technicien":                 { badge: "bg-sky-500/20 text-sky-300",      dot: "bg-sky-400"    },
  "chef d'equipe":              { badge: "bg-indigo-500/20 text-indigo-300", dot: "bg-indigo-400" },
  "responsable de maintenance": { badge: "bg-cyan-500/20 text-cyan-300",    dot: "bg-cyan-400"   },
};
