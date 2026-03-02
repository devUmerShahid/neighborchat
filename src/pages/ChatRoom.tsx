import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import type { Message } from '../types';
import { formatCountdown, getExpiryColor } from '../utils/helpers';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import ReportButton from '../components/ReportButton';

export default function ChatRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [roomName, setRoomName] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [countdown, setCountdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeWarning, setRealtimeWarning] = useState<string | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return;
    setCountdown(formatCountdown(expiresAt));
    const timer = setInterval(() => {
      setCountdown(formatCountdown(expiresAt));
    }, 30000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  useEffect(() => {
    if (!roomId) {
      setError('Invalid room ID');
      return;
    }

    const fetchRoom = async () => {
      try {
        const { data, error: roomError } = await supabase
          .from('rooms')
          .select('name, expires_at')
          .eq('id', roomId)
          .single();
        if (roomError) throw roomError;
        if (data) {
          setRoomName(data.name);
          setExpiresAt(data.expires_at);
        }
      } catch (err: any) {
        console.error('Fetch room error:', err.message);
        setError('Failed to load room');
      }
    };

    const fetchMessages = async () => {
      try {
        const { data, error: msgError } = await supabase
          .from('messages')
          .select(`
            id, content, created_at, user_id,
            profiles:user_id ( anonymous_name )
          `)
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (msgError) throw msgError;
        setMessages(data?.map((msg: any) => ({
          ...msg,
          anonymous_name: msg.profiles?.anonymous_name || 'Anonymous'
        })) || []);
      } catch (err: any) {
        console.error('Fetch messages error:', err.message);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    const setupSubscription = () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      const newChannel = supabase
        .channel(`room:${roomId}`)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
          async (payload) => {
            try {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('anonymous_name')
                .eq('id', payload.new.user_id)
                .single();

              setMessages(prev => {
                if (prev.some(m => m.id === payload.new.id)) return prev;
                return [...prev, {
                  ...payload.new as Message,
                  anonymous_name: profileData?.anonymous_name || 'Anonymous'
                }];
              });
            } catch {
              setMessages(prev => {
                if (prev.some(m => m.id === payload.new.id)) return prev;
                return [...prev, {
                  ...payload.new as Message,
                  anonymous_name: 'Anonymous'
                }];
              });
            }
          })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setRealtimeWarning(null);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setRealtimeWarning('Live updates unavailable');
          }
        });

      channelRef.current = newChannel;
    };

    fetchRoom();
    fetchMessages();
    setupSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId]);

  const handleSend = async (content: string) => {
    try {
      const { error: sendError } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          user_id: user?.id,
          content,
        });
      if (sendError) throw sendError;
    } catch (err: any) {
      console.error('Send message error:', err.message);
      alert('Failed to send: ' + err.message);
    }
  };

  const urgency = expiresAt ? getExpiryColor(expiresAt) : 'success';

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}>
        <p style={{ color: 'var(--danger)' }}>{error}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/rooms')}>
          Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      background: 'var(--bg-primary)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        flexShrink: 0,
      }}>
        <button
          className="btn-icon"
          onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, fontSize: '1rem' }}
        >
          ←
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontSize: '1rem',
            fontWeight: 700,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {roomName || 'Chat Room'}
          </h1>
          {expiresAt && (
            <span className={`badge badge-${urgency}`} style={{ marginTop: 2, fontSize: '0.625rem', padding: '2px 6px' }}>
              ⏱ {countdown}
            </span>
          )}
        </div>

        {realtimeWarning && (
          <span style={{ fontSize: '0.625rem', color: 'var(--warning)', flexShrink: 0 }}>
            ⚠️ {realtimeWarning}
          </span>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {loading ? (
          <div className="empty-state" style={{ flex: 1 }}>
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-title">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state" style={{ flex: 1 }}>
            <div className="empty-state-icon">💬</div>
            <div className="empty-state-title">No messages yet</div>
            <div className="empty-state-text">Be the first to say something!</div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} style={{ position: 'relative' }}>
                <ChatBubble
                  message={msg}
                  isOwn={msg.user_id === user?.id}
                />
                {msg.user_id !== user?.id && (
                  <div style={{
                    position: 'absolute',
                    top: 4,
                    left: 0,
                  }}>
                    <ReportButton
                      reportedUserId={msg.user_id}
                      roomId={roomId || ''}
                      reporterUserId={user?.id || ''}
                    />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={!user} />
    </div>
  );
}