import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { formatTimeAgo, truncateText } from '../utils/helpers';

interface ChatItem {
    room_id: string;
    room_name: string;
    last_message: string;
    last_message_at: string;
    last_sender: string;
}

export default function Chats() {
    const { user } = useContext(AuthContext)!;
    const navigate = useNavigate();
    const [chats, setChats] = useState<ChatItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        if (!user) return;

        try {
            // Get rooms the user has sent messages in
            const { data: userMessages, error: msgError } = await supabase
                .from('messages')
                .select('room_id')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (msgError) throw msgError;

            // Get unique room IDs
            const roomIds = [...new Set(userMessages?.map(m => m.room_id) || [])];

            if (roomIds.length === 0) {
                setChats([]);
                setLoading(false);
                return;
            }

            // For each room, get room name and last message
            const chatItems: ChatItem[] = [];

            for (const roomId of roomIds) {
                const [roomResult, messageResult] = await Promise.all([
                    supabase.from('rooms').select('name').eq('id', roomId).single(),
                    supabase.from('messages')
                        .select('content, created_at, user_id')
                        .eq('room_id', roomId)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single(),
                ]);

                if (roomResult.data && messageResult.data) {
                    let senderName = 'Someone';
                    if (messageResult.data.user_id === user.id) {
                        senderName = 'You';
                    } else {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('anonymous_name')
                            .eq('id', messageResult.data.user_id)
                            .single();
                        senderName = profile?.anonymous_name || 'Anonymous';
                    }

                    chatItems.push({
                        room_id: roomId,
                        room_name: roomResult.data.name,
                        last_message: messageResult.data.content,
                        last_message_at: messageResult.data.created_at,
                        last_sender: senderName,
                    });
                }
            }

            // Sort by latest message
            chatItems.sort((a, b) =>
                new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
            );

            setChats(chatItems);
        } catch (err: any) {
            console.error('Error fetching chats:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            {/* Header */}
            <div className="page-header">
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                    Chats
                </h1>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    Your conversations
                </p>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                {loading ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">⏳</div>
                        <div className="empty-state-title">Loading chats...</div>
                    </div>
                ) : chats.length > 0 ? (
                    <div className="stagger">
                        {chats.map((chat, i) => (
                            <div
                                key={chat.room_id}
                                className="animate-fade-in-up"
                                onClick={() => navigate(`/chat/${chat.room_id}`)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 14,
                                    padding: '14px 20px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid var(--border-color)',
                                    transition: 'background 0.15s ease',
                                    animationDelay: `${i * 60}ms`,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--accent-gradient)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    flexShrink: 0,
                                }}>
                                    💬
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.938rem', color: 'var(--text-primary)' }}>
                                            {chat.room_name}
                                        </span>
                                        <span style={{ fontSize: '0.688rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                                            {formatTimeAgo(chat.last_message_at)}
                                        </span>
                                    </div>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '0.813rem',
                                        color: 'var(--text-secondary)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{chat.last_sender}: </span>
                                        {truncateText(chat.last_message, 60)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">💬</div>
                        <div className="empty-state-title">No chats yet</div>
                        <div className="empty-state-text">
                            Join a nearby room to start chatting!
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/rooms')} style={{ marginTop: 8 }}>
                            Browse Rooms
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
