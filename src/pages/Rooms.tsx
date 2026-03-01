import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { supabase } from '../services/supabase';
import RoomCard from '../components/RoomCard';
import CreateRoomModal from '../components/CreateRoomModal';
import type { Room } from '../types';

export default function Rooms() {
  const { user } = useContext(AuthContext)!;
  const { longitude, latitude, error: geoError } = useGeolocation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [radius] = useState(5000);
  const [showCreate, setShowCreate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      fetchRooms();
    }
  }, [latitude, longitude]);

  const fetchRooms = async () => {
    if (!latitude || !longitude) return;
    try {
      const { data, error } = await supabase
        .rpc('nearby_rooms', { lat: latitude, lon: longitude, rad: radius });
      if (error) throw error;
      setRooms(data || []);
    } catch (err: any) {
      console.error('Error fetching rooms:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRooms();
  };

  const handleCreateRoom = async (name: string, topic: string) => {
    if (!latitude || !longitude) {
      alert('Location required to create a room.');
      return;
    }

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('rooms')
      .insert({
        name,
        topic,
        location: `POINT(${longitude} ${latitude})`,
        expires_at: expiresAt,
      });

    if (error) throw error;
    fetchRooms();
  };

  // Geo error state
  if (geoError) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Nearby Rooms</h1>
        </div>
        <div className="empty-state" style={{ flex: 1 }}>
          <div className="empty-state-icon">📍</div>
          <div className="empty-state-title">Location Required</div>
          <div className="empty-state-text">
            Please enable location access to discover rooms near you.
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 8 }}>{geoError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            Nearby Rooms
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            {user?.user_metadata?.anonymous_name || 'User'} • {rooms.length} active
          </p>
        </div>
        <button className="btn-icon" onClick={handleRefresh} title="Refresh">
          {refreshing ? '⏳' : '🔄'}
        </button>
      </div>

      {/* Content */}
      <div className="page-content">
        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-title">Finding nearby rooms...</div>
          </div>
        ) : rooms.length > 0 ? (
          <div className="stagger" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            maxWidth: 480,
            margin: '0 auto',
          }}>
            {rooms.map((room, i) => (
              <RoomCard key={room.id} room={room} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🏠</div>
            <div className="empty-state-title">No rooms nearby</div>
            <div className="empty-state-text">
              Be the first to start a conversation in your area!
            </div>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)} style={{ marginTop: 8 }}>
              Create a Room
            </button>
          </div>
        )}
      </div>

      {/* FAB */}
      {rooms.length > 0 && (
        <button className="fab" onClick={() => setShowCreate(true)} title="Create Room">
          ＋
        </button>
      )}

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreateRoom}
      />
    </div>
  );
}
