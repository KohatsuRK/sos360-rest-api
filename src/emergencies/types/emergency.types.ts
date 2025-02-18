import { Service, Status } from '@prisma/client';

export interface EmergencyResponse {
  id: string;
  service: Service;
  description: string;
  location: string;
  coordinates: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  requester: {
    id: string;
    name: string;
    phone: string;
  };
  attendant?: {
    id: string;
    name: string;
  };
}
