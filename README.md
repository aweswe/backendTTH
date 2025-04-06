# Travel Tech Hub Backend

A comprehensive backend system for travel technology solutions with 30 modules and 13 API endpoints.

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL via Supabase
- **API Documentation**: Swagger/OpenAPI
- **Authentication**: JWT with Passport.js
- **Caching**: Redis
- **Queue Processing**: Bull
- **Scheduled Tasks**: NestJS Schedule
- **Monitoring**: Prometheus
- **Testing**: Jest
- **AI Integration**: OpenAI API
- **PDF Generation**: Custom PDF service
- **Real-time Updates**: WebSockets
- **Offline Synchronization**: Custom sync mechanism

## Architecture

The application is built with a modular architecture consisting of 30 modules:

1. **AppModule**: Main application module
2. **BullModule**: Queue processing (8 separate queues)
3. **LoggerModule**: Custom logging
4. **PrismaModule**: Database ORM
5. **PassportModule**: Authentication strategies
6. **ThrottlerModule**: Rate limiting
7. **HttpModule**: HTTP client
8. **JwtModule**: JWT authentication
9. **PrometheusModule**: Metrics collection
10. **ConfigModule**: Environment configuration
11. **NotificationsModule**: User notifications
12. **PdfModule**: PDF generation
13. **CacheModule**: Data caching
14. **TerminusModule**: Health checks
15. **MetricsModule**: Business metrics
16. **ScheduleModule**: Scheduled tasks
17. **EventEmitterModule**: Event handling
18. **SupabaseModule**: Supabase integration
19. **DatabaseModule**: Database connection management
20. **AuthModule**: Authentication and authorization
21. **WinstonModule**: Winston logger integration
22. **OfflineSyncModule**: Offline data synchronization
23. **UsersModule**: User management
24. **PdfThemeModule**: PDF theming
25. **AiModule**: AI integration and error tracking
26. **HealthModule**: System health monitoring
27. **CustomerPortalModule**: Customer-facing features
28. **AnalyticsModule**: Business analytics
29. **LeadsModule**: Lead management
30. **ItineraryModule**: Travel itinerary management

## API Endpoints

### 1. Root (`/`)
- `GET /`: Basic application info

### 2. Health (`/health`)
- `GET /health`: Application health status

### 3. Metrics (`/metrics`)
- `GET /metrics`: Prometheus metrics endpoint

### 4. Authentication (`/auth`)
- `POST /auth/login`: User login
- `POST /auth/register`: User registration
- `POST /auth/refresh`: Refresh access token
- `GET /auth/profile`: Get current user profile

### 5. Users (`/users`)
- `GET /users`: List users (admin)
- `GET /users/:id`: Get user details
- `POST /users`: Create user
- `PATCH /users/:id`: Update user
- `DELETE /users/:id`: Delete user

### 6. Leads (`/leads`)
- `GET /leads`: List leads
- `GET /leads/:id`: Get lead details
- `POST /leads`: Create lead
- `PATCH /leads/:id`: Update lead
- `DELETE /leads/:id`: Delete lead
- `POST /leads/:id/notes`: Add note to lead
- `GET /leads/:id/ai-summary`: Generate AI summary

### 7. Itinerary (`/itinerary`)
- `GET /itinerary`: List itineraries
- `GET /itinerary/:id`: Get itinerary details
- `POST /itinerary`: Create itinerary
- `PATCH /itinerary/:id`: Update itinerary
- `DELETE /itinerary/:id`: Delete itinerary
- `POST /itinerary/:id/optimize`: Optimize itinerary with AI
- `GET /itinerary/:id/pdf`: Generate PDF

### 8. Customer Portal (`/customer-portal`)
- `GET /customer-portal/itinerary/:id`: Get customer itinerary
- `POST /customer-portal/feedback`: Submit feedback
- `GET /customer-portal/notifications`: Get customer notifications

### 9. Analytics (`/analytics`)
- `GET /analytics/overview`: Get overview statistics
- `GET /analytics/timeline`: Get sales timeline
- `GET /analytics/team-performance`: Get team performance
- `GET /analytics/lead-sources`: Get lead source distribution
- `GET /analytics/ai-insights`: Get AI-generated insights

### 10. Notifications (`/notifications`)
- `GET /notifications`: Get user notifications
- `PATCH /notifications/:id`: Mark notification as read
- `POST /notifications`: Create notification
- `GET /notifications/subscribe`: WebSocket subscription

### 11. PDF (`/pdf`)
- `POST /pdf/generate`: Generate custom PDF
- `GET /pdf/templates`: List available templates

### 12. PDF Theme (`/pdf-theme`)
- `GET /pdf-theme`: List PDF themes
- `GET /pdf-theme/:id`: Get theme details
- `POST /pdf-theme`: Create theme
- `PATCH /pdf-theme/:id`: Update theme

### 13. Offline Sync (`/offline-sync`)
- `POST /offline-sync/push`: Push offline changes
- `GET /offline-sync/pull`: Pull server changes
- `GET /offline-sync/status`: Check sync status

## Minimal Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL or Supabase account
- OpenAI API key

### Environment Variables
Create a `.env` file with:

```
# Database
DATABASE_URL=postgresql://username:password@host:port/database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Application
NODE_ENV=development
PORT=3000
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/travel-tech-hub.git
   cd travel-tech-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the minimal application**
   ```bash
   # For minimal version with basic endpoints
   NODE_ENV=production USE_MINIMAL_APP=true node start-app.js
   
   # For full application with all 30 modules
   NODE_ENV=production node start-app.js
   ```

6. **Access the API documentation**
   Open your browser and go to:
   - http://localhost:3000/swagger
   - http://localhost:3000/docs

## Features by Module

### Authentication
- JWT-based authentication
- Role-based access control
- Refresh token rotation
- Secure password hashing

### User Management
- User CRUD operations
- Role assignment
- Team management
- Profile management

### Lead Management
- Lead tracking
- Notes and attachments
- AI-generated lead summaries
- Lead status tracking
- Assignment to team members

### Itinerary Management
- Comprehensive travel itineraries
- Activity scheduling
- AI-powered route optimization
- PDF generation with custom themes
- Customer sharing

### Analytics
- Sales performance
- Team performance
- Lead source analysis
- AI-generated insights
- Custom date range filtering

### Notifications
- Real-time notifications via WebSockets
- Email notifications
- In-app notifications
- Read/unread status tracking

### PDF Generation
- Custom PDF templates
- Theming support
- Dynamic content generation
- Attachment handling

### Offline Synchronization
- Work offline capability
- Conflict resolution
- Data syncing when online
- Sync status tracking

### AI Integration
- OpenAI API integration
- AI error tracking and handling
- Lead summarization
- Itinerary optimization
- Analytics insights

### Monitoring
- Health checks
- Prometheus metrics
- Error tracking
- Performance monitoring

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is proprietary and private. All rights reserved. Unauthorized copying, distribution, or use of this software is strictly prohibited.
