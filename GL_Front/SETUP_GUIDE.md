# GMPP Frontend - Setup Guide

## Description
Frontend application for GMPP (Système de Gestion de Maintenance Préventive Planifiée) - A comprehensive preventive maintenance management system.

## Technology Stack
- **Frontend Framework**: React 18.2
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4.1
- **State Management**: React Hooks
- **Routing**: React Router DOM 7.13
- **API Client**: Axios 1.13
- **Authentication**: Keycloak (OAuth2/OIDC)
- **Icons**: React Icons 5.5
- **Code Quality**: ESLint 9.39

## Prerequisites
- Node.js 16+ or higher
- npm or yarn package manager
- Keycloak server running (for authentication)
- Backend API running on http://localhost:8080

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GL_Front
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and update with your values:
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=master
VITE_KEYCLOAK_CLIENT_ID=gmpp-frontend
VITE_API_BASE_URL=http://localhost:8080/api
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Project Structure

```
src/
├── api/                    # API service files
│   ├── machineAPI.js
│   ├── maintenancePointAPI.js
│   ├── interventionAPI.js
│   ├── userAPI.js
│   ├── dashboardAPI.js
│   ├── reportAPI.js
│   └── planningAPI.js
├── components/            # Reusable UI components
│   ├── Navigate.jsx       # Sidebar navigation
│   ├── ProtectedRoute.jsx # Route protection
│   ├── Button.jsx
│   ├── Form.jsx
│   ├── Table.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   ├── Alert.jsx
│   └── LoadingSpinner.jsx
├── pages/                 # Page components
│   ├── dashboard/
│   ├── machines/
│   ├── maintenance/
│   ├── interventions/
│   ├── planning/
│   ├── reports/
│   ├── user/
│   └── public/
├── utils/                 # Utility functions
│   ├── constants.js       # Constants and enums
│   ├── dateUtils.js       # Date formatting
│   └── formatUtils.js     # General formatting
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## Key Features

### 1. Dashboard
- KPI indicators (implementation rate, prevented failures, etc.)
- Upcoming interventions
- Machine availability
- Alerts and notifications

### 2. Machine Management
- Create, read, update, delete machines
- Search and filter functionality
- Status tracking
- Operating hours tracking

### 3. Maintenance Points
- Define maintenance operations
- Set frequencies and consumable types
- Track quantities needed
- Link to specific machines

### 4. Interventions
- Schedule maintenance interventions
- Assign technicians
- Track intervention status
- Record observations and equipment state

### 5. Planning
- Interactive monthly calendar
- View planned interventions
- See intervention details
- Status overview

### 6. Reports
- Generate customizable reports
- Export to PDF, Excel, CSV
- Historical data analysis
- Performance metrics

### 7. User Management
- Create and manage users
- Assign roles (Admin, Responsable, Chef, Technicien)
- Set specialties and certifications
- Control access permissions

## Authentication

The application uses Keycloak for authentication. Users must:
1. Be registered in Keycloak
2. Have appropriate roles assigned
3. Have a valid access token

Role-based access control ensures:
- Only authenticated users can access protected routes
- Admin-only features are restricted
- Users see appropriate navigation items

## API Integration

All API calls are centralized in the `api/` directory:
- Each module has its own API service file
- Uses Axios for HTTP requests
- Includes automatic token management
- Error handling and loading states

### Example API Usage:
```javascript
import machineAPI from '../../api/machineAPI';

// Get all machines
const response = await machineAPI.getAllMachines(page, size);

// Create a machine
await machineAPI.createMachine(machineData);

// Update a machine
await machineAPI.updateMachine(machineId, machineData);

// Delete a machine
await machineAPI.deleteMachine(machineId);
```

## Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (below 768px)

Mobile navigation uses a hamburger menu that slides in from the left.

## Component Guidelines

### Form Handling
```javascript
// Use controlled components with useState
const [formData, setFormData] = useState({...});
```

### Error Handling
```javascript
// Display alerts for user feedback
{error && <Alert type="error" message={error} />}
```

### Loading States
```javascript
// Show loading overlay during async operations
<LoadingOverlay visible={loading} />
```

## Best Practices

1. **API Calls**: Use the centralized API service files
2. **State Management**: Use React hooks (useState, useEffect)
3. **Error Handling**: Always catch errors and display user-friendly messages
4. **Loading States**: Show loading indicators during async operations
5. **Code Organization**: Keep components focused and reusable
6. **Responsive Design**: Test on multiple screen sizes
7. **Accessibility**: Use semantic HTML and proper ARIA labels

## Troubleshooting

### Blank Page or Login Loop
- Check Keycloak configuration
- Verify environment variables
- Check browser console for errors

### API Errors
- Verify backend is running on `http://localhost:8080`
- Check API endpoint URLs in API service files
- Verify authentication token is valid

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Review ESLint errors: `npm run lint`

## Performance Optimization

- Code splitting for routes
- Lazy loading of components
- Image optimization
- CSS purging with Tailwind
- Minimize API calls with caching

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Development Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "Add feature"`
3. Test thoroughly on various devices
4. Run linter: `npm run lint`
5. Push to repository
6. Create pull request

## Deployment

### Docker Deployment
See `Dockerfile` for containerization setup.

### Environment-Specific Configuration
- Development: localhost URLs
- Staging: staging server URLs
- Production: production server URLs

## Support and Documentation

- API Documentation: [Swagger/OpenAPI](http://localhost:8080/swagger-ui.html)
- Backend Repository: [Link to backend repo]
- Project Board: [Taiga.io link]

## License

[Your License Here]

## Contributing

1. Follow the code style and guidelines
2. Write meaningful commit messages
3. Test before submitting PR
4. Update documentation

---

For further assistance, contact the development team or create an issue in the project repository.
