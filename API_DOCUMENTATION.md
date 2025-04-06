# Workspace Overview

## **Project Structure**

```
API_DOCUMENTATION.md
api-test.http
APPROACH.md
DATABASE_SCHEMA.md
deploy.js
deploy.md
eslint.config.mjs
FINAL- AI CRM - LMS - ITINERARY BACKEND IMPLEMENTATION DOC (FOR CURSOR).md
nest-cli.json
package.json
README.md
ROADMAP.md
start-app.js
supabase-test.js
TECHNICAL_ARCHITECTURE.md
test-db.js
tsconfig.build.json
tsconfig.json
logs/
	combined.log
	error.log
prisma/
	dev.db
	dev.db-journal
	schema.prisma
	migrations/
		add_ai_error_tracking.sql
		migration_lock.toml
		20240705000000_add_ai_error_tracking/
		20250405075700_init/
src/
	app.controller.spec.ts
	app.controller.ts
	app.module.ts
	app.service.ts
	main.ts
	minimal.ts
	ai/
		ai-cache.service.ts
		ai-error-supabase.repository.ts
		ai-error-tracker.factory.ts
		ai-error-tracker.service.ts
		ai.module.ts
		ai.service.spec.ts
		ai.service.ts
		interfaces/
	analytics/
		analytics.controller.ts
		analytics.module.ts
		analytics.service.ts
		pipes/
	auth/
		auth.controller.ts
		auth.module.ts
		auth.service.ts
		decorators/
		dto/
		guards/
		strategies/
	bull/
		bull.module.ts
	common/
		enums/
	communication/
		communication.module.ts
	config/
		config.module.ts
		config.service.ts
		configuration.ts
		database.config.ts
	customer-portal/
		customer-portal.controller.ts
		customer-portal.module.ts
		customer-portal.service.ts
	database/
		database.decorators.ts
		database.module.ts
		migrations/
	health/
		health.controller.ts
		health.module.ts
		indicators/
	itinerary/
		itinerary.controller.ts
		itinerary.module.ts
		itinerary.service.spec.ts
		itinerary.service.ts
		dto/
	lead/
	leads/
		leads.controller.ts
		leads.module.ts
		leads.service.spec.ts
		leads.service.ts
		dto/
	logger/
		logger.module.ts
	metrics/
		metrics.controller.ts
		metrics.module.ts
		metrics/
	notifications/
		notifications.controller.ts
		notifications.gateway.ts
		notifications.module.ts
		...
	offline-sync/
		...
	pdf/
		...
	pdf-theme/
		...
	prisma/
		...
	supabase/
	test/
	users/
test/
	api.spec.ts
	app.e2e-spec.ts
	jest-e2e.json
```

---

## **Key Modules**

### **1. AI Module**
- **Files**:
  - `ai-cache.service.ts`
  - `ai-error-supabase.repository.ts`
  - `ai-error-tracker.factory.ts`
  - `ai-error-tracker.service.ts`
  - `ai.module.ts`
  - `ai.service.ts`
- **Purpose**: Handles AI-related operations, error tracking, and caching.

### **2. Analytics Module**
- **Files**:
  - `analytics.controller.ts`
  - `analytics.module.ts`
  - `analytics.service.ts`
- **Purpose**: Provides analytics and reporting features.

### **3. Auth Module**
- **Files**:
  - `auth.controller.ts`
  - `auth.module.ts`
  - `auth.service.ts`
- **Purpose**: Manages authentication, authorization, and user sessions.

### **4. Itinerary Module**
- **Files**:
  - `itinerary.controller.ts`
  - `itinerary.module.ts`
  - `itinerary.service.ts`
- **Purpose**: Handles itinerary creation, updates, and management.

### **5. Leads Module**
- **Files**:
  - `leads.controller.ts`
  - `leads.module.ts`
  - `leads.service.ts`
- **Purpose**: Manages leads, including creation, updates, and retrieval.

### **6. Notifications Module**
- **Files**:
  - `notifications.controller.ts`
  - `notifications.gateway.ts`
  - `notifications.module.ts`
- **Purpose**: Handles user notifications and real-time updates.

### **7. PDF Module**
- **Files**: (Truncated)
- **Purpose**: Generates PDFs for itineraries and other documents.

### **8. Health Module**
- **Files**:
  - `health.controller.ts`
  - `health.module.ts`
- **Purpose**: Provides health checks for the application.

---

## **Testing and Configuration**

### **Testing**
- **Test Files**:
  - `api.spec.ts`
  - `app.e2e-spec.ts`
- **Purpose**: End-to-end and API testing.

### **Configuration**
- **Files**:
  - `config.module.ts`
  - `config.service.ts`
  - `configuration.ts`
- **Purpose**: Centralized configuration management.

---

## **Database**
- **Files**:
  - `schema.prisma`
  - `migrations/`
- **Purpose**: Defines the database schema and manages migrations.

---

## **Logs**
- **Files**:
  - `combined.log`
  - `error.log`
- **Purpose**: Stores application logs for debugging and monitoring.

---

## **Scripts**
- **Files**:
  - `deploy.js`
  - `start-app.js`
  - `supabase-test.js`
  - `test-db.js`
- **Purpose**: Utility scripts for deployment, testing, and database operations.