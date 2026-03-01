import { useNavigate } from 'react-router-dom';
import type { Room } from '../types';
import { formatCountdown, getExpiryColor } from '../utils/helpers';
import { useState, useEffect } from 'react';

interface RoomCardProps {
    room: Room;
    index?: number;
}

export default function RoomCard({ room, index = 0 }: RoomCardProps) {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(formatCountdown(room.expires_at));
    const [urgency, setUrgency] = useState(getExpiryColor(room.expires_at));

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(formatCountdown(room.expires_at));
            setUrgency(getExpiryColor(room.expires_at));
        }, 30000); // Update every 30s
        return () => clearInterval(timer);
    }, [room.expires_at]);

    const isExpired = countdown === 'Expired';

    return (
        <div
            className="glass-card animate-fade-in-up"
            onClick={() => !isExpired && navigate(`/chat/${room.id}`)}
            style={{
                padding: 16,
                cursor: isExpired ? 'default' : 'pointer',
                opacity: isExpired ? 0.5 : 1,
                animationDelay: `${index * 60}ms`,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {room.name}
                </h3>
                <span className={`badge badge-${urgency}`}>
                    ⏱ {countdown}
                </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                {room.topic}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    🌍 Nearby
                </span>
                {!isExpired && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                        Join →
                    </span>
                )}
            </div>
        </div>
    );
}
