export interface SimpleItinerary {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  leadId: string;
  userId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  activities?: {
    name: string;
    description?: string;
    location: string;
    startTime: Date;
    endTime: Date;
  }[];
} 