import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
	const [isRegister, setIsRegister] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const { login, register } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			if (isRegister) {
				await register(name, email, password);
			} else {
				await login(email, password);
			}
			navigate('/tickets');
		} catch (err: any) {
			const msg = err.response?.data?.message;
			setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Authentication failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ maxWidth: '400px', margin: '80px auto', padding: '24px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'sans-serif' }}>
			<h2 style={{ marginTop: 0 }}>{isRegister ? 'Create Technician Account' : 'Repair Tracker Login'}</h2>

			{error && (
				<div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '12px', fontSize: '14px' }}>
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
				{isRegister && (
					<input
						type="text"
						placeholder="Full Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						style={{ padding: '10px', fontSize: '14px' }}
					/>
				)}
				<input
					type="email"
					placeholder="Email Address"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					style={{ padding: '10px', fontSize: '14px' }}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					minLength={6}
					style={{ padding: '10px', fontSize: '14px ' }}
				/>
				<button
					type="submit"
					disabled={loading}
					style={{ padding: '10px', fontSize: '15px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
				>
					{loading ? 'Please wait...' : isRegister ? 'Register & Sign In' : 'Sign In'}
				</button>
			</form>

			<p style={{ marginTop: '16px', fontSize: '14px', textAlign: 'center' }}>
				{isRegister ? "Already have an account?" : "Don't have an account?"}{' '}
				<button
					type="button"
					onClick={() => { setIsRegister(!isRegister); setError(''); }}
					style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
				>
					{isRegister ? 'Sign In' : 'Register'}
				</button>
			</p>
		</div>
	);
}
