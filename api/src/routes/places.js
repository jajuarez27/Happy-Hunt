import { Router } from 'express';
import { supabase } from '../lib/db.js';

const router = Router();

// GET /api/places/:id — place plus its active deals
router.get('/:id', async (req, res, next) => {
  try {
    const { data: place, error: placeError } = await supabase
      .from('places')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (placeError) throw placeError;

    const today = new Date().toISOString().slice(0, 10);
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('place_id', place.id)
      .eq('is_active', true)
      .or(`valid_from.is.null,valid_from.lte.${today}`)
      .or(`valid_until.is.null,valid_until.gte.${today}`)
      .order('category')
      .order('start_time');
    if (dealsError) throw dealsError;

    res.json({ place, deals: deals || [] });
  } catch (err) {
    if (err.code === 'PGRST116') return res.status(404).json({ error: 'Place not found' });
    next(err);
  }
});

export default router;
