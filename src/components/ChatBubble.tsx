import type { Message } from '../types';
import { formatTimeAgo } from '../utils/helpers';

interface ChatBubbleProps {
    message: Message;
    isOwn: boolean;
}

export default function ChatBubble({ message, isOwn }: ChatBubbleProps) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                marginBottom: 8,
                paddingLeft: isOwn ? 48 : 0,
                paddingRight: isOwn ? 0 : 48,
            }}
        >
            <div
                style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: isOwn
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                    background: isOwn
                        ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
                        : 'var(--bg-tertiary)',
                    color: isOwn ? '#0f172a' : 'var(--text-primary)',
                    position: 'relative',
                }}
            >
                {!isOwn && (
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--accent-primary)',
                        marginBottom: 2,
                    }}>
                        {message.anonymous_name || 'Anonymous'}
                    </div>
                )}
                <div style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                }}>
                    {message.content}
                </div>
                <div style={{
                    fontSize: '0.625rem',
                    marginTop: 4,
                    textAlign: 'right',
                    opacity: 0.7,
                    color: isOwn ? '#0f172a' : 'var(--text-muted)',
                }}>
                    {formatTimeAgo(message.created_at)}
                </div>
            </div>
        </div>
    );
}
