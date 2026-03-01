import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
    { path: '/rooms', label: 'Rooms', icon: '🏠' },
    { path: '/chats', label: 'Chats', icon: '💬' },
    { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    // Don't show nav on auth pages or chat room
    if (['/', '/login', '/signup'].includes(location.pathname) || location.pathname.startsWith('/chat/')) {
        return null;
    }

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 60,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid var(--border-color)',
            paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                maxWidth: 480,
                margin: '0 auto',
                padding: '6px 0',
            }}>
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                padding: '8px 20px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: 'var(--radius-md)',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                            }}
                        >
                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 24,
                                    height: 3,
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--accent-gradient)',
                                }} />
                            )}
                            <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
                            <span style={{
                                fontSize: '0.688rem',
                                fontWeight: isActive ? 700 : 500,
                                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                                transition: 'color 0.2s ease',
                            }}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
