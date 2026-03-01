import { useState } from 'react';

interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, topic: string) => Promise<void>;
}

export default function CreateRoomModal({ isOpen, onClose, onCreate }: CreateRoomModalProps) {
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!name.trim() || !topic.trim()) return;
        setLoading(true);
        try {
            await onCreate(name.trim(), topic.trim());
            setName('');
            setTopic('');
            onClose();
        } catch {
            // Error handled by parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Handle */}
                <div style={{
                    width: 40,
                    height: 4,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)',
                    margin: '0 auto 20px',
                }} />

                <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: 20,
                    color: 'var(--text-primary)',
                }}>
                    Create a Room
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.813rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            marginBottom: 6,
                        }}>
                            Room Name
                        </label>
                        <input
                            className="input"
                            type="text"
                            placeholder="e.g., Coffee Meetup"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={50}
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
                            Topic / Description
                        </label>
                        <input
                            className="input"
                            type="text"
                            placeholder="What's this room about?"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            maxLength={120}
                        />
                    </div>

                    <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                    }}>
                        ⏱ Room expires in 2 hours automatically
                    </p>

                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleCreate}
                            disabled={!name.trim() || !topic.trim() || loading}
                            style={{ flex: 1 }}
                        >
                            {loading ? '...' : '🚀 Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
