import { useEffect, useState, type SyntheticEvent } from 'react';
import api from '../api/axios';
import { TicketCard } from '../components/TicketCard';
import { useAuth } from '../context/AuthContext';
import type { Ticket, TicketStatus } from '../types';
import { EditTicketModal } from '../components/EditTicketModal';

export function TicketsPage() {
  const { user, logout } = useAuth();

  // Ticket list and UI states
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<String>('');

  // Modal state (null = closed, Ticket object = open for that ticket)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  //Create Ticket form states
  const [showForm, setShowForm] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [issue, setIssue] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Autohide toast notification after 3 secs
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch tickets when filters change
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError('');
      try{
        const params: Record<string, string> = {};
        if (statusFilter !== 'ALL') params.status = statusFilter;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const { data } = await api.get<Ticket[]>('/tickets', { params });
        setTickets(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    // Small 250ms debounce so typing in search doesn't spam the API on every keystroke
    const timer = setTimeout(fetchTickets, 250);
    return () => clearTimeout(timer);
  }, [statusFilter, searchQuery]);

  // Derived summary metrics (computed directly from tickets-no redundant state)
  const totalTickets = tickets.length;
  const activeCount = tickets.filter((t) => t.status !== 'COMPLETED').length;
  const completedCount = tickets.filter((t) => t.status === 'COMPLETED').length;
  const totalRevenue = tickets.reduceRight((sum, t) => sum + Number(t.estimatedCost), 0);

  const handleCreate = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data: newTicket } = await api.post<Ticket>('tickets', {
        deviceName,
        customerName,
        issue,
        estimatedCost: Number(estimatedCost),
      });

      // Prepend newly created ticket to state immediately
      setTickets((prev) => [newTicket, ...prev]);
      setDeviceName('');
      setCustomerName('');
      setIssue('');
      setEstimatedCost('');
      setShowForm(false);
      setToast('Repair ticket created');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to create ticket');
    } finally {
      setSubmitting(false)
    }
  };

  const handleStatusChange = async (id: number, status: TicketStatus) => {
    try {
      const { data: updated } = await api.patch<Ticket>(`/tickets/${id}`, { status });
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      setToast(`Status updated to ${status.replace('_', ' ')}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleEditSave = async (
    id: number,
    updates: {
      deviceName: string;
      customerName: string;
      issue: string;
      estimatedCost: number;
      status: TicketStatus;
    },
  ) => {
    try {
      const { data: updated } = await api.patch<Ticket>(`/tickets/${id}`, updates);
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated} : t)));
      setToast(`Ticket #${id} updated`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save ticket changes');
      throw err;
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this repair ticket permanently?')) return;
    try {
      await api.delete(`/tickets/${id}`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      setToast(`Ticket #${id} deleted`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete ticket');
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '32px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      {/* Toast Banner */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#111827',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 60,
          }}
        >
          ✓ {toast}
        </div>
      )}
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Repair Tickets Dashboard</h2>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Signed in as {user?.name} ({user?.email})</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '8px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            {showForm ? 'Cancel' : '+ New Ticket'}
          </button>
          <button
            onClick={logout}
            style={{ padding: '8px 14px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Visible Tickets</div>
          <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '4px' }}>{totalTickets}</div>
        </div>
        <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '12px', color: '#854d0e' }}>Active Repairs</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#854d0e', marginTop: '4px' }}>{activeCount}</div>
        </div>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '12px', color: '#166534' }}>Completed</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#166534', marginTop: '4px' }}>{completedCount}</div>
        </div>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '12px', color: '#1e40af' }}>Est. Revenue</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#1e40af', marginTop: '4px' }}>RM {totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Collapsible New Ticket Form */}
      {showForm && (
        <form onSubmit={handleCreate} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <input
            type="text"
            placeholder="Device Name (e.g. iPhone 13 Pro)"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            required
            style={{ padding: '9px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            style={{ padding: '9px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
          <input
            type="text"
            placeholder="Issue Description (e.g. Cracked OLED screen)"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
            style={{ padding: '9px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Estimated Cost (RM)"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            required
            style={{ padding: '9px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{ gridColumn: 'span 2', padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
          >
            {submitting ? 'Saving Ticket...' : 'Create Repair Ticket'}
          </button>
        </form>
      )}

      {/* Search & Status Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by device, customer, or issue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Ticket List */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>No repair tickets match your filter.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isOwner={ticket.userId === user?.id}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEdit={setEditingTicket}
            />
          ))}
        </div>
      )}

      {/* Edit Ticket Modal */}
      {editingTicket && (
        <EditTicketModal
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}