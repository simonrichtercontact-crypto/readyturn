-- ============================================================
-- TurnReady Seed Data
-- ============================================================
-- NOTE: Run this AFTER creating your first user via the app signup.
-- Replace 'YOUR_USER_ID' with your actual auth user ID from Supabase Dashboard > Authentication > Users
-- Replace 'YOUR_COMPANY_ID' after running the first INSERT below.

-- Step 1: Create a demo company
INSERT INTO companies (id, name) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Apex Property Group');

-- Step 2: Link your user to the company (replace YOUR_USER_ID)
-- INSERT INTO company_members (company_id, user_id, role) VALUES
--   ('a1b2c3d4-0000-0000-0000-000000000001', 'YOUR_USER_ID', 'owner');

-- Step 3: Properties
INSERT INTO properties (id, company_id, name, address_line_1, city, state, postal_code, notes) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'Riverside Apartments', '1200 Riverside Drive', 'Austin', 'TX', '78701',
   'Main portfolio property. 24 units total.'),
  ('b1000000-0000-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001',
   'Oak Street Flats', '450 Oak Street', 'Austin', 'TX', '78702',
   'Older building, requires more make-ready time.'),
  ('b1000000-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001',
   'Skyline Residences', '890 Congress Ave', 'Austin', 'TX', '78703',
   'Newer construction. Premium units.');

-- Step 4: Units
INSERT INTO units (id, company_id, property_id, unit_number, bedrooms, bathrooms, square_feet, market_rent, status) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', '1A', 1, 1, 750, 1250.00, 'make_ready'),
  ('c1000000-0000-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', '2B', 2, 2, 1050, 1800.00, 'make_ready'),
  ('c1000000-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', '3C', 2, 1, 950, 1650.00, 'occupied'),
  ('c1000000-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', '4D', 3, 2, 1300, 2200.00, 'ready'),
  ('c1000000-0000-0000-0000-000000000005', 'a1b2c3d4-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', '101', 1, 1, 680, 1100.00, 'make_ready'),
  ('c1000000-0000-0000-0000-000000000006', 'a1b2c3d4-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', '205', 2, 1, 880, 1450.00, 'vacant'),
  ('c1000000-0000-0000-0000-000000000007', 'a1b2c3d4-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', 'PH-1', 3, 2, 2100, 3500.00, 'occupied'),
  ('c1000000-0000-0000-0000-000000000008', 'a1b2c3d4-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', '12A', 2, 2, 1200, 2400.00, 'make_ready');

-- NOTE: Turnovers require a created_by user ID.
-- After seeding your user, uncomment and run these with your actual user ID:

/*
INSERT INTO turnovers (id, company_id, property_id, unit_id, move_out_date, target_ready_date, status, priority, notes, created_by) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001',
   CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '3 days',
   'in_progress', 'high', 'Tenant left early. Unit needs full repaint and carpet.', 'YOUR_USER_ID'),

  ('d1000000-0000-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001',
   'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002',
   CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '2 days',
   'blocked', 'urgent', 'Waiting on contractor for water damage repair.', 'YOUR_USER_ID'),

  ('d1000000-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001',
   'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000005',
   CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '7 days',
   'not_started', 'medium', NULL, 'YOUR_USER_ID'),

  ('d1000000-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001',
   'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000008',
   CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE + INTERVAL '1 day',
   'in_progress', 'urgent', 'New tenant move-in scheduled for next week.', 'YOUR_USER_ID');

INSERT INTO turnover_tasks (company_id, turnover_id, title, assigned_to_name, due_date, status, priority) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   'Remove all trash and debris', 'Mike Torres', CURRENT_DATE - INTERVAL '3 days', 'done', 'high'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   'Full unit repaint', 'Carlos Paint Co.', CURRENT_DATE + INTERVAL '1 day', 'in_progress', 'high'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   'Carpet replacement (bedroom)', 'FloorPro Austin', CURRENT_DATE + INTERVAL '2 days', 'not_started', 'high'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   'Deep clean all surfaces', 'Sparkle Clean', CURRENT_DATE + INTERVAL '3 days', 'not_started', 'medium'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   'Lock change & re-key', 'Mike Torres', CURRENT_DATE + INTERVAL '3 days', 'not_started', 'medium'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
   'Smoke detector test', NULL, CURRENT_DATE + INTERVAL '3 days', 'not_started', 'high'),

  ('a1b2c3d4-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002',
   'Emergency water extraction', 'AquaDry Services', CURRENT_DATE - INTERVAL '8 days', 'done', 'urgent'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002',
   'Drywall repair (bathroom)', 'Bob''s Construction', CURRENT_DATE - INTERVAL '2 days', 'blocked', 'urgent'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002',
   'Full repaint post-repair', 'Carlos Paint Co.', CURRENT_DATE + INTERVAL '3 days', 'not_started', 'high'),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002',
   'Final inspection', NULL, CURRENT_DATE + INTERVAL '5 days', 'not_started', 'medium');
*/
