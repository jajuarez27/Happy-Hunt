import { useCallback, useEffect, useState } from 'react';
import { getDeals } from '../api.js';
import DealCard from '../components/DealCard.jsx';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'happy_hour', label: '🍻 Happy Hour' },
  { value: 'food_special', label: '🍔 Food' },
  { value: 'drink_special', label: '🍹 Drinks' },
];

const DEFAULT_LOCATION = { lat: 40.7128, lng: -74.006 }; // NYC fallback

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [category, setCategory] = useState('');
  const [liveOnly, setLiveOnly] = useState(false);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(5);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation(DEFAULT_LOCATION),
      { timeout: 8000 }
    );
  }, []);

  const load = useCallback(async () => {
    if (!location) return;
    setStatus('loading');
    try {
      const data = await getDeals({
        lat: location.lat,
        lng: location.lng,
        radius_mi: radius,
        category: category || undefined,
        live: liveOnly || undefined,
      });
      setDeals(data.deals || []);
      setStatus('ready');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [location, radius, category, liveOnly]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <header className="page-header">
        <h1>Happy Hunt</h1>
        <span className="tagline">Deals near you</span>
      </header>

      <div className="location-row">
        <input
          type="number"
          step="0.5"
          min="0.5"
          max="25"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          aria-label="Search radius in miles"
        />
        <span className="meta" style={{ alignSelf: 'center' }}>mi radius</span>
        <button onClick={load}>Refresh</button>
      </div>

      <div className="filter-bar">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            className={`chip ${category === c.value ? 'active' : ''}`}
            onClick={() => setCategory(c.value)}
          >
            {c.label}
          </button>
        ))}
        <button
          className={`chip ${liveOnly ? 'active' : ''}`}
          onClick={() => setLiveOnly((v) => !v)}
        >
          ● Live now
        </button>
      </div>

      {status === 'loading' && <div className="state-msg">Hunting for deals…</div>}
      {status === 'error' && (
        <div className="state-msg error-msg">
          Couldn't load deals: {error}
          <br />
          <button className="chip" onClick={load} style={{ marginTop: 12 }}>
            Try again
          </button>
        </div>
      )}
      {status === 'ready' && deals.length === 0 && (
        <div className="state-msg">
          No deals found nearby. Try widening your radius or check back later.
        </div>
      )}
      {status === 'ready' && deals.length > 0 && (
        <div className="deal-list">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </>
  );
}
