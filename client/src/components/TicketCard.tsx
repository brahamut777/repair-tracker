import type { Ticket, TicketStatus } from '../types';

interface TicketCardProps {
	ticket: Ticket;
	isOwner: boolean;
	onStatusChange: (id: number, status: TicketStatus) => Promise<void>;
	onEdit: (ticket: Ticket) => void;
	onDelete: (id: number) => Promise<void>;
}

const STATUS_COLORS: Record<TicketStatus, { bg: string; text: string }> = {
	PENDING: { bg: '#fef3c7', text: '#92400e' },
	IN_PROGRESS: { bg: '#dbeafe', text: '#1e40af' },
	COMPLETED: { bg: '#dcfce7', text: '#166534' },
	READY: { bg: '#e9c995', text: '#0a2b16' },
};

export function TicketCard({ ticket, isOwner, onStatusChange, onEdit, onDelete }: TicketCardProps){
	const badge = STATUS_COLORS[ticket.status];

	return (
		<div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
			<div style={{ flex: 1 }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
					<strong style={{ fontSize: '16px' }}>{ticket.deviceName}</strong>
					<span style={{ background: badge.bg, color: badge.text, padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
						{ticket.status.replace('_', ' ')}
					</span>
					{!isOwner && (
						<span style={{ fontSize: '12px', color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>
							Read-Only
						</span>
					)}
				</div>

				<p style={{ margin: '4px 0', color: '#374151', fontSize: '14px' }}>{ticket.issue}</p>

				<div style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
					Customer: <strong>{ticket.customerName}</strong> • Estimated Cost: <strong>RM {Number(ticket.estimatedCost).toFixed(2)}</strong>
					{ticket.user && <> • Tech: {ticket.user.name}</>}
				</div>
			</div>

			{isOwner && (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
					<select
						value={ticket.status}
            onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
            style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px' }}
					>
						<option value="PENDING">Pending</option>
						<option value="IN_PROGRESS">In Progress</option>
						<option value="COMPLETED">Completed</option>
					</select>

					<div>
						<button
							type="button"
							onClick={() => onEdit(ticket)}
							style={{ padding: '5px 10px', background: '#e0e7ff', color: '#1d4ed8', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
						>
							Edit
						</button>
						<button
							type="button"
							onClick={() => onDelete(ticket.id)}
							style={{ padding: '5px 10px', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
						>
							Delete
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
