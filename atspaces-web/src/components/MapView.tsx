import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icon
const customIcon = new L.DivIcon({
    className: 'custom-map-marker',
    html: `<div style="
        width: 36px;
        height: 36px;
        background: var(--primary, #FF5B04);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
    "><div style="
        transform: rotate(45deg);
        color: white;
        font-size: 14px;
        font-weight: 700;
    ">●</div></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
});

interface Workspace {
    id: string;
    title: string;
    location: string;
    rating: number;
    price: number;
    type: string;
    image: string;
    lat: number;
    lng: number;
}

interface MapViewProps {
    workspaces: Workspace[];
}

const MapView = ({ workspaces }: MapViewProps) => {
    return (
        <div style={{ borderRadius: '20px', overflow: 'hidden', height: '600px', border: '1px solid var(--border)' }}>
            <MapContainer
                center={[31.963, 35.890]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {workspaces.map((space) => (
                    <Marker key={space.id} position={[space.lat, space.lng]} icon={customIcon}>
                        <Popup className="custom-popup">
                            <div style={{
                                minWidth: '220px',
                                fontFamily: 'inherit'
                            }}>
                                <img
                                    src={space.image}
                                    alt={space.title}
                                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }}
                                />
                                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{space.title}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                    <MapPin size={12} /> {space.location}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>
                                        <Star size={14} fill="currentColor" /> {space.rating}
                                    </div>
                                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>JOD {space.price}/hr</span>
                                </div>
                                <Link
                                    to={`/workspaces/${space.id}`}
                                    className="btn-primary"
                                    style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        padding: '0.5rem',
                                        textDecoration: 'none',
                                        fontSize: '0.85rem',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                >
                                    View Details
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <style>{`
                .custom-popup .leaflet-popup-content-wrapper {
                    background: var(--bg-deep);
                    color: var(--text-primary);
                    border-radius: 16px;
                    padding: 4px;
                    border: 1px solid var(--border);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                }
                .custom-popup .leaflet-popup-tip {
                    background: var(--bg-deep);
                    border: 1px solid var(--border);
                }
                .custom-popup .leaflet-popup-close-button {
                    color: var(--text-secondary) !important;
                    font-size: 20px !important;
                    padding: 8px 8px 0 0 !important;
                    width: 30px !important;
                    height: 30px !important;
                }
                .custom-popup .leaflet-popup-close-button:hover {
                    color: var(--text-primary) !important;
                    background: transparent !important;
                }
                .leaflet-container {
                    background: #111 !important;
                }
            `}</style>
        </div>
    );
};

export default MapView;
