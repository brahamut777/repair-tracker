import { useState, type SyntheticEvent } from 'react';
import type { Ticket, TicketStatus } from '../types';

interface EditTicketModalProps {
  ticket: Ticket;
  onClose: () => void;
  onSave: (
    id: number,
    updates: {
      deviceName: string;
      customerName: string;
      issue: string;
      estimatedCost: number;
      status: TicketStatus;
    },
  ) => Promise<void>
}

export function EditTicketModal({ ticket, onClose, onSave }: EditTicketModalProps) {
  const [deviceName, setDeviceName] = useState(ticket.deviceName);
  const [customerName, setCustomerName] = useState(ticket.customerName);
  const [issue, setIssue] = useState(ticket.issue);
  const [estimatedCost, setEstimatedCost] = useState(String(ticket.estimatedCost));
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(ticket.id, {
        deviceName,
        customerName,
        issue,
        estimatedCost: Number(estimatedCost),
        status,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '24px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Edit Ticket #{ticket.id}</h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6b7280' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>
            Device Name
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              required
              style={{ width: '100%', marginTop: '4px', padding: '9px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
            />
          </label>

          <label style={{ fontSize: '13px', fontWeight: 600 }}>
            Customer Name
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              style={{ width: '100%', marginTop: '4px', padding: '9px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
            />
          </label>

          <label style={{ fontSize: '13px', fontWeight: 600 }}>
            Issue Description
            <input
              type="text"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
              style={{ width: '100%', marginTop: '4px', padding: '9px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>
              Estimated Cost (RM)
              <input
                type="number"
                step="0.01"
                min="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                required
                style={{ width: '100%', marginTop: '4px', padding: '9px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
              />
            </label>

            <label style={{ fontSize: '13px', fontWeight: 600 }}>
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TicketStatus)}
                style={{ width: '100%', marginTop: '4px', padding: '9px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 14px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}