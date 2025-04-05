FINAL: AI CRM + LMS + ITINERARY BACKEND IMPLEMENTATION DOC (FOR CURSOR) What We Are Building 

We’re creating a modular, full-featured SaaS backend that includes: 

A powerful Lead Management System (LMS) 

A Smart AI-based Itinerary Planner 

A full CRM workflow with communication and sales flow 

Deep AI integrations (summaries, suggestions, NLP) 

Admin Dashboard + Advanced Analytics 

A User-facing Customer Portal 

Dynamic PDF Generator with Theme Designer 

Real-time queues and scalable structure for production 

\--- 

Tech Stack (For Backend Now) 

NestJS (TypeScript) — Framework 

Prisma ORM 

Supabase (Dev) → PostgreSQL (Prod) 

BullMQ — Job Queues 

Redis — Caching and BullMQ support 

PDFKit / Puppeteer — For templated PDFs 

DeepSeek API — For AI tasks (summaries, NLP, recommendations) JWT + Role Guards — Auth 

Swagger — API Docs 

S3 or Supabase Storage — Files 

Socket.IO (Optional) — Realtime chat or updates 

\--- 

Modules + API Structure 

1. LMS Module 

Leads 

POST /leads 

GET /leads/:id 

PUT /leads/:id 

DELETE /leads/:id 

GET /leads/search?q= 

Notes/Timeline POST /leads/:id/notes GET /leads/:id/notes 

Quotes + PDF 

POST /leads/:id/quote 

GET /leads/:id/quote/pdf?theme= 

AI Features 

POST /leads/:id/ai-summary POST /leads/duplicate-check POST /leads/ai-suggest 

Communication 

POST /leads/:id/whatsapp POST /leads/:id/email 

Offline Sync 

POST /leads/sync-offline 

\--- 

2. Itinerary Module Preferences 

   POST /itinerary/preferences GET /itinerary/:id/preferences 

   Builder 

   POST /itinerary 

   GET /itinerary/:id PUT /itinerary/:id DELETE /itinerary/:id 

   AI + Pricing 

   POST /itinerary/ai-recommend POST /itinerary/optimize-route POST /itinerary/:id/calculate-cost 

   PDF + Sharing 

   GET /itinerary/:id/pdf POST /itinerary/:id/approve 

   --- 

3. Auth + Roles Module 

POST /auth/login 

POST /auth/register 

GET /me 

GET /roles 

POST /admin/user (assign roles) 

\--- 

4. Admin Dashboard + Analytics 

GET /admin/overview — lead stats, quote count, booking ratio GET /admin/sales-timeline — time-based graphs 

GET /admin/team-performance — per agent data 

POST /admin/theme — manage PDF themes 

GET /admin/logs — user actions, sync failures 

\--- 

5. Customer Portal APIs 

POST /portal/login 

GET /portal/itinerary/:id — view only POST /portal/itinerary/:id/feedback POST /portal/approve 

POST /portal/upload — optional file uploads 

\--- 

AI Integrations 

Lead Summary — Use DeepSeek text API 

Duplicate Detection — Use embeddings 

Smart Suggestion — AI recommendations for routes, notes Cost Forecasting — Basic math + AI hybrid 

PDF Content — Generated from JSON + theme 

\--- 

Backend Focus Now 

We are not leaving these features for later: Admin Dashboard 

Customer Portal 

Analytics Dashboard 

PDF Theme Designer 

Everything will be modular and built during backend dev phase. 

\--- 

Architecture Instructions for Cursor 

Follow modular folder structure: 

/lms/, /itinerary/, /auth/, /ai/, /admin/, /customer/, /common/ 

Use NestJS services to split logic per module 

Use Prisma schema for each domain 

Make endpoints API-first, dev-friendly, with Swagger 

Keep AI logic clean and separate via /ai services 

BullMQ for mail/PDF queues 

Don't use Docker/Postgres in Cursor, stick with Supabase now. 
