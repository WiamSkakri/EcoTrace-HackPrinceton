import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import styles from '@/styles/Map.module.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface SustainablePlace {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description: string;
  rating: number;
}

export default function Map() {
  const [userLocation, setUserLocation] = useState<[number, number]>([42.3601, -71.0589]); // Default: Boston
  const [places] = useState<SustainablePlace[]>([
    {
      id: 1,
      name: 'Green Earth Market',
      category: 'Organic Store',
      lat: 42.3601,
      lng: -71.0589,
      description: 'Local organic groceries and sustainable products',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Eco Refill Station',
      category: 'Zero Waste',
      lat: 42.3611,
      lng: -71.0599,
      description: 'Package-free shopping and refill station',
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Solar Cafe',
      category: 'Sustainable Restaurant',
      lat: 42.3591,
      lng: -71.0579,
      description: '100% solar-powered cafe with local ingredients',
      rating: 4.7,
    },
  ]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Organic Store': '#4ade80',
      'Zero Waste': '#22c55e',
      'Sustainable Restaurant': '#10b981',
      'default': '#4ade80',
    };
    return colors[category] || colors.default;
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🗺️ Sustainable Places Near You</h1>
          <p className={styles.subtitle}>Discover eco-friendly businesses and services</p>
        </div>

        <div className={styles.mapContainer}>
          {typeof window !== 'undefined' && (
            <MapContainer
              center={userLocation}
              zoom={14}
              style={{ height: '100%', width: '100%', borderRadius: '16px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {places.map((place) => (
                <Marker key={place.id} position={[place.lat, place.lng]}>
                  <Popup>
                    <div className={styles.popupContent}>
                      <h3 className={styles.placeName}>{place.name}</h3>
                      <p className={styles.placeCategory} style={{ color: getCategoryColor(place.category) }}>
                        {place.category}
                      </p>
                      <p className={styles.placeDescription}>{place.description}</p>
                      <div className={styles.placeRating}>
                        ⭐ {place.rating}/5
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        <div className={styles.placesList}>
          <h2 className={styles.listTitle}>Nearby Sustainable Places</h2>
          <div className={styles.placesGrid}>
            {places.map((place) => (
              <div key={place.id} className={styles.placeCard}>
                <div className={styles.placeCardHeader}>
                  <h3 className={styles.placeCardName}>{place.name}</h3>
                  <span className={styles.placeCardRating}>⭐ {place.rating}</span>
                </div>
                <p className={styles.placeCardCategory} style={{ color: getCategoryColor(place.category) }}>
                  {place.category}
                </p>
                <p className={styles.placeCardDescription}>{place.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
