export interface Room {
    id: string;
    name: string;
    topic: string;
    location?: string;
    expires_at: string;
    created_at?: string;
    distance?: number;
}

export interface Message {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    room_id?: string;
    anonymous_name?: string;
    profiles?: { anonymous_name: string } | null;
}

export interface UserProfile {
    id: string;
    anonymous_name: string;
    created_at?: string;
}

export interface ChatPreview {
    room_id: string;
    room_name: string;
    last_message: string;
    last_message_at: string;
    unread?: boolean;
}
