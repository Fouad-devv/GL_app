package com.gmpp.maintenance.util;

public class Constants {

    // Application Constants
    public static final String API_V1 = "/api/v1";
    public static final String APPLICATION_NAME = "GMPP Maintenance Application";
    public static final String APPLICATION_VERSION = "1.0.0";

    // Response Messages
    public static final String SUCCESS = "Operation successful";
    public static final String ERROR = "An error occurred";
    public static final String NOT_FOUND = "Resource not found";
    public static final String INVALID_INPUT = "Invalid input";
    public static final String UNAUTHORIZED = "Unauthorized access";
    public static final String FORBIDDEN = "Access forbidden";

    // Machine Status Constants
    public static final String MACHINE_STATUS_OPERATIONAL = "EN_SERVICE";
    public static final String MACHINE_STATUS_MAINTENANCE = "EN_MAINTENANCE";
    public static final String MACHINE_STATUS_REPAIR = "EN_REPARATION";
    public static final String MACHINE_STATUS_OUT_OF_SERVICE = "HORS_SERVICE";

    // Intervention Status Constants
    public static final String INTERVENTION_STATUS_PLANNED = "PLANIFIEE";
    public static final String INTERVENTION_STATUS_IN_PROGRESS = "EN_COURS";
    public static final String INTERVENTION_STATUS_COMPLETED = "TERMINEE";
    public static final String INTERVENTION_STATUS_CANCELLED = "ANNULEE";
    public static final String INTERVENTION_STATUS_DELAYED = "EN_RETARD";

    // User Roles
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_MAINTENANCE_MANAGER = "RESPONSABLE_MAINTENANCE";
    public static final String ROLE_TEAM_LEADER = "CHEF_EQUIPE";
    public static final String ROLE_TECHNICIAN = "TECHNICIEN";

    // Pagination Constants
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_NUMBER = 0;

    // Time Constants
    public static final int SESSION_TIMEOUT_MINUTES = 30;
    public static final int REQUEST_TIMEOUT_MILLISECONDS = 30000;

    // File Upload Constants
    public static final long MAX_FILE_SIZE = 10485760; // 10 MB
    public static final String[] ALLOWED_FILE_TYPES = {"pdf", "xlsx", "csv", "txt"};

    // Default Values
    public static final Integer DEFAULT_INTERVENTION_DURATION = 60; // minutes
    public static final Double DEFAULT_MACHINE_AVAILABILITY = 95.0; // percentage
}
