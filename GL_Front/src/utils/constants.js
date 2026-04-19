// Utility constants
export const MACHINE_TYPES = [
  { value: 'HYDRAULIQUE', label: 'Hydraulique' },
  { value: 'PNEUMATIQUE', label: 'Pneumatique' },
  { value: 'ELECTRIQUE', label: 'Électrique' },
  { value: 'CNC', label: 'CNC' },
];

export const MACHINE_STATUS = [
  { value: 'EN_SERVICE', label: 'En service' },
  { value: 'EN_MAINTENANCE', label: 'En maintenance' },
  { value: 'HORS_SERVICE', label: 'Hors service' },
  { value: 'EN_REPARATION', label: 'En réparation' },
];

export const MAINTENANCE_OPERATION_TYPES = [
  { value: 'GRAISSAGE', label: 'Graissage' },
  { value: 'VIDANGE_HUILE', label: 'Vidange d\'huile' },
  { value: 'VERIFICATION_COURROIE', label: 'Vérification courroie' },
  { value: 'VERIFICATION_ROULEMENT', label: 'Vérification roulement' },
  { value: 'CONTROLE_FILTRES', label: 'Contrôle filtres' },
  { value: 'SERRAGE_VISSERIE', label: 'Serrage visserie' },
];

export const MAINTENANCE_FREQUENCIES = [
  { value: 'QUOTIDIENNE', label: 'Quotidienne' },
  { value: 'HEBDOMADAIRE', label: 'Hebdomadaire' },
  { value: 'MENSUELLE', label: 'Mensuelle' },
  { value: 'TRIMESTRIELLE', label: 'Trimestrielle' },
  { value: 'SEMESTRIELLE', label: 'Semestrielle' },
  { value: 'ANNUELLE', label: 'Annuelle' },
  { value: 'HEURES_FONCTIONNEMENT', label: 'Basée sur heures de fonctionnement' },
];

export const INTERVENTION_STATUS = [
  { value: 'PLANIFIEE', label: 'Planifiée', color: 'blue' },
  { value: 'EN_COURS', label: 'En cours', color: 'yellow' },
  { value: 'TERMINEE', label: 'Terminée', color: 'green' },
  { value: 'ANNULEE', label: 'Annulée', color: 'gray' },
  { value: 'EN_RETARD', label: 'En retard', color: 'red' },
];

export const EQUIPMENT_STATE = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'USURE_DETECTEE', label: 'Usure détectée' },
  { value: 'ANOMALIE_TROUVEE', label: 'Anomalie trouvée' },
  { value: 'REPARATION_NECESSAIRE', label: 'Réparation nécessaire' },
];

export const USER_ROLES = [
  { value: 'ADMIN', label: 'Administrateur' },
  { value: 'RESPONSABLE_MAINTENANCE', label: 'Responsable Maintenance' },
  { value: 'CHEF_EQUIPE', label: 'Chef d\'équipe' },
  { value: 'TECHNICIEN', label: 'Technicien' },
];

export const SPECIALTIES = [
  { value: 'MECANIQUE', label: 'Mécanique' },
  { value: 'ELECTRIQUE', label: 'Électrique' },
  { value: 'HYDRAULIQUE', label: 'Hydraulique' },
  { value: 'PNEUMATIQUE', label: 'Pneumatique' },
];

export const CONSUMABLE_TYPES = [
  { value: 'GRAISSE', label: 'Graisse' },
  { value: 'HUILE', label: 'Huile' },
  { value: 'FILTRE', label: 'Filtre' },
  { value: 'PIECES_DETACHEES', label: 'Pièces détachées' },
];

export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

export const ALERT_THRESHOLDS = {
  DAYS_7: 7,
  DAYS_3: 3,
  DAYS_1: 1,
};
