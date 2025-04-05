# Technical Architecture

## System Overview

The system is built using a modular microservices architecture with the following key components:

1. **API Gateway**
   - Routes requests to appropriate services
   - Handles authentication and authorization
   - Rate limiting and request validation
   - Load balancing

2. **Core Services**
   - Authentication Service
   - User Management Service
   - Role Management Service

3. **Business Services**
   - Lead Management Service
   - Itinerary Service
   - Analytics Service
   - PDF Generation Service

4. **AI Services**
   - Lead Analysis Service
   - Itinerary Recommendation Service
   - Route Optimization Service

5. **Infrastructure Services**
   - Redis Cache
   - BullMQ Queue
   - Supabase/PostgreSQL Database
   - S3/Supabase Storage

## Technology Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: Supabase (Dev) → PostgreSQL (Prod)
- **Cache**: Redis
- **Queue**: BullMQ
- **Storage**: S3/Supabase Storage
- **PDF Generation**: PDFKit/Puppeteer
- **AI Integration**: DeepSeek API
- **API Documentation**: Swagger

### Frontend (Future)
- React/Next.js
- TypeScript
- Tailwind CSS
- React Query
- Socket.IO Client

## Architecture Patterns

### 1. Microservices Architecture
- Each module is a separate service
- Services communicate via REST APIs
- Independent deployment and scaling
- Service-specific databases

### 2. Event-Driven Architecture
- BullMQ for async operations
- Redis for pub/sub
- Event sourcing for critical operations

### 3. CQRS Pattern
- Separate read and write models
- Optimized queries for analytics
- Event sourcing for audit trails

### 4. Repository Pattern
- Abstract data access layer
- Consistent data access across services
- Easy to switch data sources

## Security Architecture

### 1. Authentication
- JWT-based authentication
- Refresh token rotation
- Role-based access control
- OAuth2 integration (future)

### 2. Authorization
- Role-based permissions
- Resource-level access control
- API key management
- IP whitelisting

### 3. Data Security
- Encryption at rest
- TLS for data in transit
- Secure password hashing
- Regular security audits

## Scalability Design

### 1. Horizontal Scaling
- Stateless services
- Load balancing
- Database sharding
- Cache distribution

### 2. Performance Optimization
- Redis caching
- Query optimization
- Connection pooling
- Batch processing

### 3. High Availability
- Multi-region deployment
- Database replication
- Failover mechanisms
- Backup strategies

## Monitoring and Logging

### 1. Application Monitoring
- Performance metrics
- Error tracking
- User activity logs
- System health checks

### 2. Infrastructure Monitoring
- Resource utilization
- Network performance
- Database metrics
- Cache hit rates

### 3. Logging Strategy
- Structured logging
- Log aggregation
- Error tracking
- Audit trails

## Deployment Architecture

### 1. Development Environment
- Local development setup
- Docker containers
- Automated testing
- CI/CD pipeline

### 2. Staging Environment
- Production-like setup
- Performance testing
- Security testing
- User acceptance testing

### 3. Production Environment
- Multi-region deployment
- Auto-scaling
- Load balancing
- Disaster recovery

## Integration Points

### 1. External Services
- Email service
- SMS service
- Payment gateway
- AI services

### 2. Third-Party APIs
- Maps API
- Weather API
- Currency API
- Social media APIs

### 3. Internal Services
- Authentication service
- User management
- Analytics service
- PDF generation

## Future Considerations

### 1. Scalability
- Microservices expansion
- Database sharding
- Cache optimization
- Load balancing

### 2. Features
- Real-time chat
- Video conferencing
- Mobile app
- AI enhancements

### 3. Infrastructure
- Kubernetes deployment
- Service mesh
- Multi-cloud support
- Edge computing

# Project Setup Requirements

## Required APIs and Services

### 1. Database
- **Supabase (Development)**
  - Database URL format: `postgresql://user:password@host:port/database`
  - Required ENV: `DATABASE_URL`

### 2. AI Services
- **DeepSeek AI**
  - Required ENV: `DEEPSEEK_API_KEY`
  - Purpose: Text analysis, summaries
  
- **OpenAI**
  - Required ENV: `OPENAI_API_KEY`
  - Purpose: AI recommendations, NLP tasks

### 3. Email Service (Choose One)
- **SendGrid**
  - Required ENV: `SENDGRID_API_KEY`
  - Purpose: Email communications
  
- **Amazon SES**
  - Required ENV:
    ```
    AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY
    AWS_REGION
    ```
  - Purpose: Email communications

### 4. WhatsApp Integration
- **WhatsApp Business API**
  - Required ENV:
    ```
    WHATSAPP_API_KEY
    WHATSAPP_PHONE_NUMBER
    ```
  - Purpose: WhatsApp communications

### 5. File Storage (Choose One)
- **AWS S3**
  - Required ENV:
    ```
    AWS_S3_BUCKET
    AWS_S3_REGION
    AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY
    ```
  
- **Supabase Storage**
  - Required ENV:
    ```
    SUPABASE_URL
    SUPABASE_KEY
    ```

### 6. Redis (for Queue Management)
- Required ENV:
  ```
  REDIS_HOST
  REDIS_PORT
  REDIS_PASSWORD
  ```
- Purpose: BullMQ queue management

## Environment Variables Template

```env
# Application
PORT=3000
NODE_ENV=development
API_PREFIX=/api/v1
CORS_ORIGIN=*

# Database
DATABASE_URL=your_database_url

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# AI Services
DEEPSEEK_API_KEY=your_deepseek_key
OPENAI_API_KEY=your_openai_key

# Email (Choose one)
SENDGRID_API_KEY=your_sendgrid_key
# or
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region

# WhatsApp
WHATSAPP_API_KEY=your_whatsapp_key
WHATSAPP_PHONE_NUMBER=your_whatsapp_number

# Storage (Choose one)
AWS_S3_BUCKET=your_bucket_name
AWS_S3_REGION=your_s3_region
# or
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Redis
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

## Required NPM Packages

```json
{
  "dependencies": {
    "@nestjs/common": "latest",
    "@nestjs/core": "latest",
    "@nestjs/platform-express": "latest",
    "@nestjs/websockets": "latest",
    "@nestjs/platform-socket.io": "latest",
    "@nestjs/bull": "latest",
    "@nestjs/jwt": "latest",
    "@nestjs/passport": "latest",
    "@nestjs/swagger": "latest",
    "@prisma/client": "latest",
    "bull": "latest",
    "pdfkit": "latest",
    "puppeteer": "latest",
    "socket.io": "latest",
    "aws-sdk": "latest",
    "@sendgrid/mail": "latest",
    "redis": "latest",
    "class-validator": "latest",
    "class-transformer": "latest"
  },
  "devDependencies": {
    "prisma": "latest",
    "@types/node": "latest",
    "@types/bull": "latest",
    "@types/pdfkit": "latest",
    "typescript": "latest"
  }
}
```

## Setup Steps

1. **Initial Setup**
   - Clone repository
   - Install dependencies: `npm install`
   - Copy `.env.example` to `.env` and fill in values

2. **Database Setup**
   - Run Prisma migrations: `npx prisma migrate dev`
   - Generate Prisma client: `npx prisma generate`

3. **Service Setup**
   - Create accounts on required services
   - Generate API keys
   - Update environment variables

4. **Redis Setup**
   - Set up Redis instance
   - Update Redis configuration

5. **Testing**
   - Test database connection
   - Test external service connections
   - Run integration tests

## Implemented Features Status

✅ Core Backend Structure
✅ Authentication & Authorization
✅ Lead Management System
✅ Itinerary Planning
✅ Customer Portal
✅ Real-time Notifications
✅ PDF Theme Designer Structure
✅ Communication System Structure
✅ Offline Sync Structure
✅ Analytics Dashboard Structure

## Next Steps

1. Implement service integrations
2. Set up external APIs
3. Configure environment variables
4. Run database migrations
5. Test all integrations
6. Deploy application 