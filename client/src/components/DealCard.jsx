import { Link } from 'react-router-dom';
import { formatDistance, formatSchedule, isLiveNow } from '../utils.js';

const CATEGORY_LABELS = {
  happy_hour: 'Happy Hour',
  food_special: 'Food Special',
  drink_special: 'Drink Special',
};

export default function DealCard({ deal }) {
  const live = isLiveNow(deal);
  return (
    <Link to={`/deals/${deal.id}`} className="deal-card">
      <div className="top">
        <span className="venue">{deal.place?.name || 'Unknown venue'}</span>
        {deal.distance_mi != null && (
          <span className="distance">{formatDistance(deal.distance_mi)}</span>
        )}
      </div>
      <div className="deal-title">{deal.title}</div>
      <div className="badge-row">
        <span className={`badge category-${deal.category}`}>
          {CATEGORY_LABELS[deal.category] || deal.category}
        </span>
        {live && <span className="badge live">Live now</span>}
        {deal.is_verified && <span className="badge">Verified</span>}
      </div>
      <div className="schedule">{formatSchedule(deal)}</div>
    </Link>
  );
}
