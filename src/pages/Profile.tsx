import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

export default function Profile() {
    const { user, signOut } = useContext(AuthContext)!;
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(user?.user_metadata?.anonymous_name || '');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const currentName = user?.user_metadata?.anonymous_name || 'Anonymous';

    const handleSave = async () => {
        if (!newName.trim() || newName.trim() === currentName) {
            setEditing(false);
            return;
        }

        setSaving(true);
        setMessage('');
        try {
            // Update auth metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { anonymous_name: newName.trim() }
            });
            if (authError) throw authError;

            // Update profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({ id: user.id, anonymous_name: newName.trim() }, { onConflict: 'id' });
            if (profileError) throw profileError;

            setMessage('Name updated!');
            setEditing(false);
        } catch (err: any) {
            setMessage('Failed: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (err: any) {
            console.error('Sign out error:', err.message);
        }
    };

    return (
        <div className="page">
            {/* Header */}
            <div className="page-header">
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                    Profile
                </h1>
            </div>

            <div className="page-content" style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
                {/* Profile Card */}
                <div className="glass-card animate-fade-in-up" style={{ padding: 24, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                        {/* Avatar */}
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--accent-gradient)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.75rem',
                            flexShrink: 0,
                        }}>
                            👤
                        </div>
                        <div style={{ flex: 1 }}>
                            {editing ? (
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input
                                        className="input"
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        maxLength={30}
                                        autoFocus
                                        style={{ padding: '8px 12px' }}
                                    />
                                    <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '8px 16px', fontSize: '0.813rem' }}>
                                        {saving ? '...' : '✓'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
                                        {currentName}
                                    </h2>
                                    <button
                                        onClick={() => { setNewName(currentName); setEditing(true); setMessage(''); }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--accent-primary)',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            padding: 0,
                                            marginTop: 2,
                                        }}
                                    >
                                        ✏️ Edit name
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {message && (
                        <div style={{
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)',
                            background: message.startsWith('Failed')
                                ? 'rgba(239, 68, 68, 0.1)'
                                : 'rgba(16, 185, 129, 0.1)',
                            color: message.startsWith('Failed') ? '#f87171' : '#34d399',
                            fontSize: '0.813rem',
                        }}>
                            {message}
                        </div>
                    )}

                    <div className="divider" />

                    <div style={{ fontSize: '0.813rem', color: 'var(--text-secondary)' }}>
                        <p style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            ✉️ <span>{user?.email}</span>
                        </p>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h3 style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '0 4px',
                        marginBottom: 8,
                    }}>
                        Preferences
                    </h3>
                    <div className="glass-card" style={{ overflow: 'hidden' }}>
                        {[
                            { icon: '🔔', label: 'Notifications', value: 'Coming soon' },
                            { icon: '🌙', label: 'Dark Mode', value: 'Always on' },
                            { icon: '📍', label: 'Location Radius', value: '5 km' },
                        ].map((item, i) => (
                            <div key={item.label} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '14px 16px',
                                borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none',
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.875rem' }}>
                                    {item.icon} {item.label}
                                </span>
                                <span style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* About */}
                <div className="animate-fade-in-up" style={{ marginTop: 16, animationDelay: '200ms' }}>
                    <h3 style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '0 4px',
                        marginBottom: 8,
                    }}>
                        About
                    </h3>
                    <div className="glass-card" style={{ overflow: 'hidden' }}>
                        {[
                            { icon: 'ℹ️', label: 'Version', value: '1.0.0' },
                            { icon: '🔒', label: 'Privacy', value: 'No data stored on servers' },
                            { icon: '⏱', label: 'Messages expire', value: 'After 24 hours' },
                        ].map((item, i) => (
                            <div key={item.label} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '14px 16px',
                                borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none',
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.875rem' }}>
                                    {item.icon} {item.label}
                                </span>
                                <span style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sign Out */}
                <div className="animate-fade-in-up" style={{ marginTop: 24, animationDelay: '300ms' }}>
                    <button
                        className="btn btn-danger"
                        onClick={handleSignOut}
                        style={{ width: '100%' }}
                    >
                        Sign Out
                    </button>
                </div>

                {/* Footer */}
                <p style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: 24,
                    paddingBottom: 16,
                }}>
                    Made with ❤️ for local communities
                </p>
            </div>
        </div>
    );
}
