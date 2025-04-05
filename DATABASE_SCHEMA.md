# Database Schema

## Core Models

### User
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  firstName     String
  lastName      String
  role          Role      @relation(fields: [roleId], references: [id])
  roleId        String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLogin     DateTime?
  isActive      Boolean   @default(true)
  
  leads         Lead[]
  notes         Note[]
  itineraries   Itinerary[]
}
```

### Role
```prisma
model Role {
  id          String    @id @default(uuid())
  name        String    @unique
  permissions String[]
  users       User[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## LMS Module

### Lead
```prisma
model Lead {
  id            String    @id @default(uuid())
  firstName     String
  lastName      String
  email         String
  phone         String?
  status        LeadStatus
  source        String?
  assignedTo    User      @relation(fields: [assignedToId], references: [id])
  assignedToId  String
  notes         Note[]
  quotes        Quote[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastContacted DateTime?
  aiSummary     String?
}
```

### Note
```prisma
model Note {
  id        String    @id @default(uuid())
  content   String
  lead      Lead      @relation(fields: [leadId], references: [id])
  leadId    String
  user      User      @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Quote
```prisma
model Quote {
  id          String    @id @default(uuid())
  amount      Float
  currency    String
  status      QuoteStatus
  lead        Lead      @relation(fields: [leadId], references: [id])
  leadId      String
  items       QuoteItem[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  validUntil  DateTime?
}
```

## Itinerary Module

### Itinerary
```prisma
model Itinerary {
  id            String    @id @default(uuid())
  title         String
  description   String?
  status        ItineraryStatus
  user          User      @relation(fields: [userId], references: [id])
  userId        String
  activities    Activity[]
  preferences   Preference?
  totalCost     Float?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  approvedAt    DateTime?
  customerId    String?
}
```

### Activity
```prisma
model Activity {
  id            String    @id @default(uuid())
  title         String
  description   String?
  startTime     DateTime
  endTime       DateTime
  location      String
  cost          Float?
  itinerary     Itinerary @relation(fields: [itineraryId], references: [id])
  itineraryId   String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Preference
```prisma
model Preference {
  id            String    @id @default(uuid())
  budget        Float?
  interests     String[]
  restrictions  String[]
  itinerary     Itinerary @relation(fields: [itineraryId], references: [id])
  itineraryId   String    @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## Admin Module

### Analytics
```prisma
model Analytics {
  id            String    @id @default(uuid())
  metric        String
  value         Float
  period        String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### SystemLog
```prisma
model SystemLog {
  id            String    @id @default(uuid())
  level         LogLevel
  message       String
  source        String
  metadata      Json?
  createdAt     DateTime  @default(now())
}
```

## Enums

```prisma
enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  PROPOSAL_SENT
  NEGOTIATION
  WON
  LOST
}

enum QuoteStatus {
  DRAFT
  SENT
  ACCEPTED
  REJECTED
  EXPIRED
}

enum ItineraryStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  REJECTED
  COMPLETED
}

enum LogLevel {
  INFO
  WARNING
  ERROR
  DEBUG
}
``` 