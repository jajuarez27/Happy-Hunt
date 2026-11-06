import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPlace } from '../api.js';

export default function PlacePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    getPlace(id)
      .then((d) => {
        setData(d);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, [id]);

  if (status === 'loading') return <div className="state-msg">Loading…</div>;
  if (status === 'error') return <div className="state-msg error-msg">{error}</div>;
  if (!data?.place) return <div className="state-msg">Place not found.</div>;

  const { place, deals = [] } = data;
  const mapsUrl = place.lat != null
    ? `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`
    : null;

  return (
    <>
      <Link to="/" className="meta">← Back to deals</Link>
      <div className="detail-card" style={{ marginTop: 12 }}>
        <h1>{place.name}</h1>
        <p className="meta">
          {[place.address, place.neighborhood, place.city].filter(Boolean).join(' · ')}
        </p>
        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            Get directions →
          </a>
        )}
      </div>

      <div className="section-title">Deals here ({deals.length})</div>
      {deals.length === 0 && (
        <p className="meta">No active deals listed for this place yet.</p>
      )}
      <div className="deal-list">
        {deals.map((deal) => (
          <Link key={deal.id} to={`/deals/${deal.id}`} className="deal-card">
            <div className="deal-title">{deal.title}</div>
            <div className="schedule">
              {deal.days_of_week?.length === 7
                ? 'Daily'
                : (deal.days_of_week || []).join(', ')}{' '}
              · {deal.start_time}–{deal.end_time}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
