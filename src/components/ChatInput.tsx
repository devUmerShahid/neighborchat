import { useState } from 'react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (!text.trim() || disabled) return;
        onSend(text.trim());
        setText('');
    };

    return (
        <div style={{
            display: 'flex',
            gap: 8,
            padding: '12px 16px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--border-color)',
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        }}>
            <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={disabled}
                className="input"
                style={{
                    flex: 1,
                    borderRadius: 'var(--radius-full)',
                    padding: '10px 20px',
                }}
            />
            <button
                onClick={handleSend}
                disabled={!text.trim() || disabled}
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-full)',
                    background: text.trim() ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                    border: 'none',
                    color: text.trim() ? 'var(--bg-primary)' : 'var(--text-muted)',
                    fontSize: '1.125rem',
                    cursor: text.trim() ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                ➤
            </button>
        </div>
    );
}
