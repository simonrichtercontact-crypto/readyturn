-- ============================================================
-- TurnReady Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnover_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnover_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- COMPANIES policies
-- ============================================================
CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (
    id IN (
      SELECT company_id FROM company_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners/admins can update company"
  ON companies FOR UPDATE
  USING (
    id IN (
      SELECT company_id FROM company_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Companies are created via service role during signup only

-- ============================================================
-- PROFILES policies
-- ============================================================
CREATE POLICY "Users can view profiles in their company"
  ON profiles FOR SELECT
  USING (
    id = auth.uid()
    OR
    id IN (
      SELECT user_id FROM company_members
      WHERE company_id = get_my_company_id()
    )
  );

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- ============================================================
-- COMPANY MEMBERS policies
-- ============================================================
CREATE POLICY "Members can view their company's members"
  ON company_members FOR SELECT
  USING (
    company_id = get_my_company_id()
  );

CREATE POLICY "Owners can manage company members"
  ON company_members FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM company_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- ============================================================
-- PROPERTIES policies
-- ============================================================
CREATE POLICY "Members can view their company's properties"
  ON properties FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "Members can insert properties for their company"
  ON properties FOR INSERT
  WITH CHECK (company_id = get_my_company_id());

CREATE POLICY "Members can update their company's properties"
  ON properties FOR UPDATE
  USING (company_id = get_my_company_id());

CREATE POLICY "Admins can delete properties"
  ON properties FOR DELETE
  USING (
    company_id IN (
      SELECT company_id FROM company_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================================
-- UNITS policies
-- ============================================================
CREATE POLICY "Members can view their company's units"
  ON units FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "Members can insert units for their company"
  ON units FOR INSERT
  WITH CHECK (company_id = get_my_company_id());

CREATE POLICY "Members can update their company's units"
  ON units FOR UPDATE
  USING (company_id = get_my_company_id());

CREATE POLICY "Admins can delete units"
  ON units FOR DELETE
  USING (
    company_id IN (
      SELECT company_id FROM company_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================================
-- TURNOVERS policies
-- ============================================================
CREATE POLICY "Members can view their company's turnovers"
  ON turnovers FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "Members can create turnovers for their company"
  ON turnovers FOR INSERT
  WITH CHECK (company_id = get_my_company_id());

CREATE POLICY "Members can update their company's turnovers"
  ON turnovers FOR UPDATE
  USING (company_id = get_my_company_id());

CREATE POLICY "Admins can delete turnovers"
  ON turnovers FOR DELETE
  USING (
    company_id IN (
      SELECT company_id FROM company_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================================
-- TURNOVER TASKS policies
-- ============================================================
CREATE POLICY "Members can view their company's tasks"
  ON turnover_tasks FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "Members can create tasks for their company"
  ON turnover_tasks FOR INSERT
  WITH CHECK (company_id = get_my_company_id());

CREATE POLICY "Members can update their company's tasks"
  ON turnover_tasks FOR UPDATE
  USING (company_id = get_my_company_id());

CREATE POLICY "Members can delete tasks in their company"
  ON turnover_tasks FOR DELETE
  USING (company_id = get_my_company_id());

-- ============================================================
-- TURNOVER PHOTOS policies
-- ============================================================
CREATE POLICY "Members can view their company's photos"
  ON turnover_photos FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "Members can upload photos for their company"
  ON turnover_photos FOR INSERT
  WITH CHECK (company_id = get_my_company_id());

CREATE POLICY "Members can delete their company's photos"
  ON turnover_photos FOR DELETE
  USING (company_id = get_my_company_id());

-- ============================================================
-- ACTIVITY LOGS policies
-- ============================================================
CREATE POLICY "Members can view their company's activity"
  ON activity_logs FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "Members can insert activity for their company"
  ON activity_logs FOR INSERT
  WITH CHECK (company_id = get_my_company_id());

-- ============================================================
-- STORAGE POLICIES
-- Run these in Supabase Storage section
-- ============================================================

-- Create a bucket called 'turnover-photos' with public=false
-- Then apply these policies:

/*
-- Allow members to upload photos to their company's folder
CREATE POLICY "Members can upload to their company folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'turnover-photos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = get_my_company_id()::text
  );

-- Allow members to view photos in their company's folder
CREATE POLICY "Members can view their company's photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'turnover-photos'
    AND (storage.foldername(name))[1] = get_my_company_id()::text
  );

-- Allow members to delete their company's photos
CREATE POLICY "Members can delete their company's photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'turnover-photos'
    AND (storage.foldername(name))[1] = get_my_company_id()::text
  );
*/
