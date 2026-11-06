import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDeal } from '../api.js';
import { formatDistance, formatSchedule } from '../utils.js';

const CATEGORY_LABELS = {
  happy_hour: 'Happy Hour',
  food_special: 'Food Special',
  drink_special: 'Drink Special',
};

export default function DealDetailPage() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    getDeal(id)
      .then((data) => {
        setDeal(data.deal);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, [id]);

  if (status === 'loading') return <div className="state-msg">Loading…</div>;
  if (status === 'error') return <div className="state-msg error-msg">{error}</div>;
  if (!deal) return <div className="state-msg">Deal not found.</div>;

  const place = deal.place || {};
  const mapsUrl = place.lat != null
    ? `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`
    : null;

  return (
    <>
      <Link to="/" className="meta">← Back to deals</Link>
      <div className="detail-card" style={{ marginTop: 12 }}>
        <span className={`badge category-${deal.category}`}>
          {CATEGORY_LABELS[deal.category] || deal.category}
        </span>
        <h1 className="deal-title">{deal.title}</h1>
        <p className="meta">
          {deal.description || 'No description provided.'}
        </p>
      </div>

      <div className="detail-card">
        <div className="section-title">Venue</div>
        <h2>
          <Link to={`/places/${place.id}`}>{place.name}</Link>
        </h2>
        <p className="meta">
          {[place.address, place.neighborhood].filter(Boolean).join(' · ')}
        </p>
        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            Get directions →
          </a>
        )}
      </div>

      <div className="detail-card">
        <div className="section-title">Schedule</div>
        <p>{formatSchedule(deal)}</p>
        <p className="meta">
          {deal.distance_mi != null && `${formatDistance(deal.distance_mi)} away · `}
          {deal.is_verified ? 'Community verified' : 'Unverified listing'}
        </p>
      </div>
    </>
  );
}
