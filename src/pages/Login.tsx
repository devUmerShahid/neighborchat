import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
    const { signIn } = useContext(AuthContext)!;
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/rooms');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px',
            background: 'var(--bg-primary)',
        }}>
            {/* Branding */}
            <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{
                    fontSize: '3rem',
                    marginBottom: 12,
                    animation: 'float 3s ease-in-out infinite',
                }}>
                    💬
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                    <span className="text-gradient">NeighborChat</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Anonymous local conversations
                </p>
            </div>

            {/* Form Card */}
            <div className="glass-card animate-fade-in-up" style={{
                width: '100%',
                maxWidth: 400,
                padding: 28,
                animationDelay: '100ms',
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 24 }}>
                    Welcome back
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.813rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            marginBottom: 6,
                        }}>
                            Email
                        </label>
                        <input
                            className="input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.813rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            marginBottom: 6,
                        }}>
                            Password
                        </label>
                        <input
                            className="input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171',
                            fontSize: '0.813rem',
                        }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>

            {/* Footer link */}
            <p className="animate-fade-in-up" style={{
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                marginTop: 24,
                animationDelay: '200ms',
            }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                    Sign Up
                </Link>
            </p>
        </div>
    );
}
