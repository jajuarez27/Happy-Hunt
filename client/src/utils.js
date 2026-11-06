const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatDistance(mi) {
  return mi < 0.1 ? '<0.1 mi' : `${mi.toFixed(1)} mi`;
}

export function formatSchedule(deal) {
  const days = (deal.days_of_week || [])
    .slice()
    .sort((a, b) => a - b)
    .map((d) => DAY_LABELS[d]);
  const daysText = days.length === 7 ? 'Daily' : days.join(', ');
  return `${daysText} · ${deal.start_time}–${deal.end_time}`;
}

export function isLiveNow(deal) {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = deal.start_time.split(':').map(Number);
  const [eh, em] = deal.end_time.split(':').map(Number);
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  const dayMatch = deal.days_of_week.includes(day);
  if (end <= start) {
    // overnight window (e.g. 10pm–2am)
    return dayMatch ? mins >= start : mins <= end && deal.days_of_week.includes((day + 6) % 7);
  }
  return dayMatch && mins >= start && mins < end;
}
