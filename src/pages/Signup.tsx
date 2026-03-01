import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Signup() {
    const { signUp } = useContext(AuthContext)!;
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [anonName, setAnonName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!anonName.trim()) {
            setError('Please choose an anonymous name');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password, anonName.trim());
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 20px',
                textAlign: 'center',
            }}>
                <div className="animate-fade-in-up" style={{ fontSize: '3rem', marginBottom: 16 }}>✉️</div>
                <h2 className="animate-fade-in-up" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>
                    Check your email
                </h2>
                <p className="animate-fade-in-up" style={{ color: 'var(--text-secondary)', maxWidth: 300, marginBottom: 24, lineHeight: 1.6 }}>
                    We've sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
                    Click the link to activate your account.
                </p>
                <button className="btn btn-primary animate-fade-in-up" onClick={() => navigate('/login')}>
                    Go to Login
                </button>
            </div>
        );
    }

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
            <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: '3rem', marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>
                    🌍
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                    <span className="text-gradient">Join NeighborChat</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Connect anonymously with people nearby
                </p>
            </div>

            {/* Features */}
            <div className="animate-fade-in-up" style={{
                display: 'flex',
                gap: 16,
                marginBottom: 28,
                width: '100%',
                maxWidth: 400,
                animationDelay: '50ms',
            }}>
                {[
                    { icon: '🔒', text: 'Anonymous' },
                    { icon: '⏱', text: 'Ephemeral' },
                    { icon: '📍', text: 'Local' },
                ].map((f) => (
                    <div key={f.text} style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>{f.icon}</div>
                        <div style={{ fontSize: '0.688rem', color: 'var(--text-muted)', fontWeight: 600 }}>{f.text}</div>
                    </div>
                ))}
            </div>

            {/* Form Card */}
            <div className="glass-card animate-fade-in-up" style={{
                width: '100%',
                maxWidth: 400,
                padding: 28,
                animationDelay: '100ms',
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 24 }}>
                    Create your account
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
                            Anonymous Name
                        </label>
                        <input
                            className="input"
                            type="text"
                            placeholder="e.g., NightOwl42"
                            value={anonName}
                            onChange={(e) => setAnonName(e.target.value)}
                            maxLength={30}
                            required
                        />
                        <p style={{ fontSize: '0.688rem', color: 'var(--text-muted)', marginTop: 4 }}>
                            This is how others will see you — keep it anonymous!
                        </p>
                    </div>

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
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            autoComplete="new-password"
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
                        {loading ? 'Creating account...' : '🚀 Sign Up'}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <p className="animate-fade-in-up" style={{
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                marginTop: 24,
                animationDelay: '200ms',
            }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                    Sign In
                </Link>
            </p>
        </div>
    );
}
