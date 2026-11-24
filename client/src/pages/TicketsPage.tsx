import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { Ticket } from '../types';

export function TicketsPage() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    api.get<Ticket[]>('/tickets').then((res) => setTickets(res.data));
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Welcome, {user?.name}</h2>
        <button onClick={logout} style={{ padding: '8px 14px', cursor: 'pointer' }}>Logout</button>
      </div>
      <p>Connexted to NestJS! Loaded <strong>{tickets.length}</strong> tickets from PostgreSQL</p>
    </div>
  );
}