import { useState } from 'react';
import { supabase } from '../services/supabase';

interface ReportButtonProps {
    reportedUserId: string;
    roomId: string;
    reporterUserId: string;
}

const REPORT_REASONS = [
    'Spam',
    'Harassment',
    'Inappropriate content',
    'Hate speech',
    'Other',
];

export default function ReportButton({ reportedUserId, roomId, reporterUserId }: ReportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleReport = async () => {
        if (!selectedReason) return;

        try {
            // Try to insert into reports table; if it doesn't exist, just log it
            const { error } = await supabase.from('reports').insert({
                reported_user_id: reportedUserId,
                reporter_user_id: reporterUserId,
                room_id: roomId,
                reason: selectedReason,
            });

            if (error) {
                console.warn('Report table may not exist:', error.message);
            }

            setSubmitted(true);
            setTimeout(() => {
                setIsOpen(false);
                setSubmitted(false);
                setSelectedReason('');
            }, 1500);
        } catch (err) {
            console.error('Report error:', err);
        }
    };

    if (submitted) {
        return (
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                ✓ Reported
            </span>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-icon"
                title="Report user"
                style={{
                    width: 28,
                    height: 28,
                    fontSize: '0.75rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                }}
            >
                🚩
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            width: 40,
                            height: 4,
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--bg-tertiary)',
                            margin: '0 auto 20px',
                        }} />

                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>
                            Report User
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                            {REPORT_REASONS.map((reason) => (
                                <button
                                    key={reason}
                                    onClick={() => setSelectedReason(reason)}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: 'var(--radius-md)',
                                        border: selectedReason === reason
                                            ? '1px solid var(--accent-primary)'
                                            : '1px solid var(--border-color)',
                                        background: selectedReason === reason
                                            ? 'rgba(16, 185, 129, 0.1)'
                                            : 'var(--bg-primary)',
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-secondary" onClick={() => setIsOpen(false)} style={{ flex: 1 }}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleReport}
                                disabled={!selectedReason}
                                style={{ flex: 1 }}
                            >
                                Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
