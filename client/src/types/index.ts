export type TicketStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'READY';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Ticket {
  id: number;
  deviceName: string;
  customerName: string;
  issue: string;
  status: TicketStatus;
  estimatedCost: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
