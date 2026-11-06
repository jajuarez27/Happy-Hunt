import { Router } from 'express';
import { supabase } from '../lib/db.js';
import { haversineMiles, parseLatLng } from '../lib/geo.js';

const router = Router();
const CATEGORIES = ['happy_hour', 'food_special', 'drink_special'];

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function isLiveNow(deal, now = new Date()) {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(deal.start_time);
  const end = toMinutes(deal.end_time);
  const dayMatch = deal.days_of_week.includes(day);
  if (end <= start) {
    return dayMatch ? mins >= start : mins <= end && deal.days_of_week.includes((day + 6) % 7);
  }
  return dayMatch && mins >= start && mins < end;
}

// GET /api/deals?lat=&lng=&radius_mi=&category=&live=
router.get('/', async (req, res, next) => {
  try {
    const { category, live } = req.query;
    const radiusMi = Math.min(parseFloat(req.query.radius_mi) || 5, 50);
    const origin = parseLatLng(req.query);

    let placesQuery = supabase
      .from('places')
      .select('id, name, address, neighborhood, city, lat, lng')
      .eq('is_active', true);

    if (origin) {
      // Rough bounding-box prefilter, then exact haversine below.
      const latDelta = radiusMi / 69;
      const lngDelta = radiusMi / (69 * Math.cos((origin.lat * Math.PI) / 180) || 1);
      placesQuery = placesQuery
        .gte('lat', origin.lat - latDelta)
        .lte('lat', origin.lat + latDelta)
        .gte('lng', origin.lng - lngDelta)
        .lte('lng', origin.lng + lngDelta);
    }

    const { data: places, error: placesError } = await placesQuery;
    if (placesError) throw placesError;

    let nearby = places || [];
    if (origin) {
      nearby = nearby
        .map((p) => ({ ...p, distance_mi: haversineMiles(origin.lat, origin.lng, p.lat, p.lng) }))
        .filter((p) => p.distance_mi <= radiusMi)
        .sort((a, b) => a.distance_mi - b.distance_mi);
    }

    const placeIds = nearby.map((p) => p.id);
    if (placeIds.length === 0) return res.json({ deals: [] });

    let dealsQuery = supabase
      .from('deals')
      .select('id, place_id, title, description, category, days_of_week, start_time, end_time, is_verified, valid_from, valid_until')
      .in('place_id', placeIds)
      .eq('is_active', true);

    if (CATEGORIES.includes(category)) dealsQuery = dealsQuery.eq('category', category);

    const today = new Date().toISOString().slice(0, 10);
    dealsQuery = dealsQuery
      .or(`valid_from.is.null,valid_from.lte.${today}`)
      .or(`valid_until.is.null,valid_until.gte.${today}`);

    const { data: deals, error: dealsError } = await dealsQuery;
    if (dealsError) throw dealsError;

    const placeById = new Map(nearby.map((p) => [p.id, p]));
    let result = (deals || [])
      .map((d) => ({
        ...d,
        place: placeById.get(d.place_id),
        distance_mi: placeById.get(d.place_id)?.distance_mi,
      }))
      .filter((d) => !live || isLiveNow(d));

    result.sort((a, b) => (a.distance_mi ?? 999) - (b.distance_mi ?? 999));
    res.json({ deals: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/deals/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { data: deal, error } = await supabase
      .from('deals')
      .select('*, place:places(*)')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json({ deal });
  } catch (err) {
    if (err.code === 'PGRST116') return res.status(404).json({ error: 'Deal not found' });
    next(err);
  }
});

export default router;
