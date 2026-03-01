/**
 * Format a date string to relative "time ago" (e.g., "2m ago", "1h ago")
 */
export function formatTimeAgo(dateStr: string): string {
    const now = Date.now();
    const date = new Date(dateStr).getTime();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

/**
 * Format countdown until expiry (e.g., "1h 23m left")
 */
export function formatCountdown(expiresAt: string): string {
    const now = Date.now();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) return 'Expired';

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) return `${hours}h ${remainingMinutes}m left`;
    return `${remainingMinutes}m left`;
}

/**
 * Get urgency color class based on time remaining
 * green (>1h) → warning (30m-1h) → danger (<30m)
 */
export function getExpiryColor(expiresAt: string): 'success' | 'warning' | 'danger' {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'danger';
    if (diff < 30 * 60 * 1000) return 'danger';
    if (diff < 60 * 60 * 1000) return 'warning';
    return 'success';
}

/**
 * Truncate text to maxLen characters with ellipsis
 */
export function truncateText(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).trim() + '…';
}

/**
 * Haversine distance calculation between two coordinates (in meters)
 */
export function calculateDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
): number {
    const R = 6371e3; // Earth's radius in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
}

/**
 * Format distance for display (e.g., "500m", "1.2km")
 */
export function formatDistance(meters: number): string {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
}
