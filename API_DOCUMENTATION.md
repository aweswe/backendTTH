# API Documentation

## Authentication

### POST /auth/login
```typescript
Request:
{
  email: string;
  password: string;
}

Response:
{
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }
}
```

### POST /auth/register
```typescript
Request:
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
}

Response:
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}
```

## LMS Module

### Leads

#### GET /leads
Query Parameters:
- page: number
- limit: number
- status: LeadStatus
- search: string
- assignedTo: string

Response:
```typescript
{
  data: Lead[];
  total: number;
  page: number;
  limit: number;
}
```

#### POST /leads
Request:
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source?: string;
  assignedToId: string;
}
```

#### GET /leads/:id
Response:
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source?: string;
  assignedTo: User;
  notes: Note[];
  quotes: Quote[];
  createdAt: string;
  updatedAt: string;
}
```

#### PUT /leads/:id
Request:
```typescript
{
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  source?: string;
  assignedToId?: string;
}
```

### Notes

#### POST /leads/:id/notes
Request:
```typescript
{
  content: string;
}
```

#### GET /leads/:id/notes
Response:
```typescript
{
  data: Note[];
  total: number;
}
```

### Quotes

#### POST /leads/:id/quotes
Request:
```typescript
{
  amount: number;
  currency: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  validUntil?: string;
}
```

#### GET /leads/:id/quotes
Response:
```typescript
{
  data: Quote[];
  total: number;
}
```

## Itinerary Module

### Itineraries

#### POST /itineraries
Request:
```typescript
{
  title: string;
  description?: string;
  preferences?: {
    budget?: number;
    interests?: string[];
    restrictions?: string[];
  };
}
```

#### GET /itineraries/:id
Response:
```typescript
{
  id: string;
  title: string;
  description?: string;
  status: ItineraryStatus;
  activities: Activity[];
  preferences?: Preference;
  totalCost?: number;
  createdAt: string;
  updatedAt: string;
}
```

#### POST /itineraries/:id/activities
Request:
```typescript
{
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location: string;
  cost?: number;
}
```

### AI Features

#### POST /itineraries/:id/ai-recommend
Response:
```typescript
{
  recommendations: {
    activity: string;
    location: string;
    duration: string;
    cost: number;
    description: string;
  }[];
}
```

#### POST /itineraries/:id/optimize-route
Response:
```typescript
{
  optimizedActivities: Activity[];
  totalCost: number;
  totalDuration: string;
}
```

## Admin Module

### Analytics

#### GET /admin/analytics
Query Parameters:
- period: string (daily, weekly, monthly)
- startDate: string
- endDate: string

Response:
```typescript
{
  leads: {
    total: number;
    byStatus: Record<LeadStatus, number>;
    conversionRate: number;
  };
  quotes: {
    total: number;
    byStatus: Record<QuoteStatus, number>;
    averageAmount: number;
  };
  itineraries: {
    total: number;
    byStatus: Record<ItineraryStatus, number>;
    averageCost: number;
  };
}
```

### User Management

#### GET /admin/users
Response:
```typescript
{
  data: User[];
  total: number;
}
```

#### POST /admin/users
Request:
```typescript
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
}
```

## Customer Portal

### GET /portal/itineraries/:id
Response:
```typescript
{
  id: string;
  title: string;
  description?: string;
  activities: Activity[];
  totalCost?: number;
  status: ItineraryStatus;
}
```

### POST /portal/itineraries/:id/feedback
Request:
```typescript
{
  rating: number;
  comment?: string;
}
```

### POST /portal/itineraries/:id/approve
Response:
```typescript
{
  success: boolean;
  message: string;
}
``` 