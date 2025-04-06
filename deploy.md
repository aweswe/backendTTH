# Travel Tech Hub Backend - Deployment Guide

This document explains the deployment process and issues fixed for the Travel Tech Hub Backend.

## Fixed Issues

1. **ParseDatePipe Missing**
   - Created a custom `ParseDatePipe` in `src/analytics/pipes/parse-date.pipe.ts`
   - Added to the providers array in `AnalyticsModule`
   - Updated imports in `AnalyticsController` 

2. **Circular Dependencies**
   - Fixed circular dependency between `NotificationsService` and `NotificationsGateway`
   - Removed `NotificationsService` injection from `NotificationsGateway` constructor

3. **Redis Dependencies**
   - Removed Redis health checks from `HealthModule` 
   - Commented out Redis health indicator in controller

4. **Swagger Integration**
   - Created `/docs` and `/swagger` endpoints with full Swagger UI
   - Added proper documentation for API endpoints

## Deployment Process

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Build Application**
   ```bash
   npm run build
   ```

4. **Run Application**

   For development:
   ```bash
   npm run start:dev
   ```

   For production:
   ```bash
   npx ts-node src/minimal.ts
   ```

   Or use the deployment script:
   ```bash
   node deploy.js
   ```

## Environment Variables

The application uses these environment variables:

- `PORT` - Web server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` - Supabase credentials
- `OPENAI_API_KEY` - OpenAI API key for AI features

## API Documentation

The API documentation is available at:
- http://localhost:3000/docs
- http://localhost:3000/swagger 