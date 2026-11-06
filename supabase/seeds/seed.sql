-- Seed data: sample NYC-area venues and deals
-- Coordinates are approximations for demo purposes.

insert into places (name, category, address, neighborhood, city, state, lat, lng, phone, website) values
  ('The Hidden Lantern', 'bar', '118 E 1st St', 'East Village', 'New York', 'NY', 40.7265, -73.9870, '(212) 555-0134', null),
  ('Copper Kettle Pub', 'pub', '402 Atlantic Ave', 'Boerum Hill', 'Brooklyn', 'NY', 40.6890, -73.9900, '(718) 555-0198', null),
  ('Verde Taqueria', 'restaurant', '77 Bedford Ave', 'Williamsburg', 'Brooklyn', 'NY', 40.7140, -73.9610, '(718) 555-0162', null),
  ('The Gilded Fox', 'wine_bar', '230 W 19th St', 'Flatiron', 'New York', 'NY', 40.7410, -73.9920, '(212) 555-0117', null),
  ('Hops & Heroes Brewery', 'brewery', '15 W 26th St', 'Flatiron', 'New York', 'NY', 40.7460, -73.9930, '(212) 555-0145', null);

insert into deals (place_id, title, description, category, days_of_week, start_time, end_time, price_hint, is_verified) values
  ((select id from places where name = 'The Hidden Lantern'),
   'Weekday Well Liquor',
   'House liquor pours and domestic drafts for $5.',
   'happy_hour', '{1,2,3,4,5}', '16:00', '19:00', '$5 pours', true),

  ((select id from places where name = 'The Hidden Lantern'),
   'Taco Tuesday',
   'Two tacos for $6, all day Tuesday.',
   'food_special', '{2}', '00:00', '23:59', '$6 for 2', true),

  ((select id from places where name = 'Copper Kettle Pub'),
   'Pint Night',
   'Pints of house ale for $4 every weekday afternoon.',
   'drink_special', '{1,2,3,4,5}', '15:00', '18:00', '$4 pints', false),

  ((select id from places where name = 'Verde Taqueria'),
   'Nacho Average Hour',
   'Half-price nachos and $3 margaritas, Mon–Fri 4–7pm.',
   'happy_hour', '{1,2,3,4,5}', '16:00', '19:00', 'Half price', true),

  ((select id from places where name = 'The Gilded Fox'),
   'Golden Hour Flight',
   'Three-glass wine flight for $12, Thu–Sat evenings.',
   'drink_special', '{4,5,6}', '17:00', '21:00', '$12 flight', true),

  ((select id from places where name = 'The Gilded Fox'),
   'Oyster Hour',
   '$1.50 oysters on the half shell, daily 5–6pm.',
   'food_special', '{0,1,2,3,4,5,6}', '17:00', '18:00', '$1.50 each', false),

  ((select id from places where name = 'Hops & Heroes Brewery'),
   'Flight Friday',
   'Four 4oz tasting pours for $10.',
   'drink_special', '{5}', '16:00', '20:00', '$10 flight', true),

  ((select id from places where name = 'Hops & Heroes Brewery'),
   'Soft Pretzel & Mustard Deal',
   'Free soft pretzel with any pint purchase after 4pm.',
   'food_special', '{3,4,5}', '16:00', '23:00', 'Free w/ pint', false);
