-- =======================================================
-- وسِيطي - مخطط قاعدة البيانات PostgreSQL
-- جاهز للتنفيذ المباشر - copy-paste ready
-- =======================================================

-- تفعيل الإضافات المطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =======================================================
-- 1. جداول المستخدمين والمصادقة
-- =======================================================

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  phone text UNIQUE,
  name text NOT NULL,
  password_hash text,
  role text NOT NULL DEFAULT 'agent',
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =======================================================
-- 2. مساحات العمل والفرق
-- =======================================================

CREATE TABLE workspaces (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE,
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE user_workspaces (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY(user_id, workspace_id)
);

-- =======================================================
-- 3. الاشتراكات والمدفوعات
-- =======================================================

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  plan_id text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id uuid REFERENCES subscriptions(id),
  workspace_id uuid REFERENCES workspaces(id),
  amount_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'SAR',
  provider text NOT NULL,
  provider_payment_id text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- =======================================================
-- 4. المنصات والتكاملات
-- =======================================================

CREATE TABLE platforms (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  supports_oauth boolean DEFAULT false,
  supports_api_publish boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE platform_accounts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  platform_id int REFERENCES platforms(id) ON DELETE CASCADE,
  account_identifier text,
  oauth_token text,
  api_key text,
  connected boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =======================================================
-- 5. العقارات والملفات
-- =======================================================

CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text NOT NULL,
  category text NOT NULL,
  city text NOT NULL,
  district text,
  address text,
  location point,
  area_m2 numeric(10,2),
  bedrooms int,
  bathrooms int,
  price numeric(15,2) NOT NULL,
  currency text DEFAULT 'SAR',
  features text[],
  status text DEFAULT 'draft',
  views_count int DEFAULT 0,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE property_files (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  file_type text NOT NULL,
  file_name text NOT NULL,
  url text NOT NULL,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- =======================================================
-- 6. الإعلانات والنشر
-- =======================================================

CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  title text NOT NULL,
  price numeric(15,2) NOT NULL,
  status text DEFAULT 'draft',
  platform_listing_meta jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE publish_jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  platform_account_id uuid REFERENCES platform_accounts(id),
  status text DEFAULT 'pending',
  platform_response jsonb,
  platform_url text,
  attempts int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  finished_at timestamptz
);

-- =======================================================
-- 7. CRM - العملاء والأنشطة
-- =======================================================

CREATE TABLE crm_contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  source text,
  source_meta jsonb DEFAULT '{}',
  full_name text NOT NULL,
  phone text,
  email text,
  type text DEFAULT 'lead',
  status text DEFAULT 'new',
  assigned_to uuid REFERENCES users(id),
  lead_score int DEFAULT 0,
  budget_max numeric(15,2),
  requirements text,
  last_contact_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE crm_tags (
  id serial PRIMARY KEY,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text DEFAULT '#D4AF37'
);

CREATE TABLE crm_contact_tags (
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  tag_id int REFERENCES crm_tags(id) ON DELETE CASCADE,
  PRIMARY KEY(contact_id, tag_id)
);

CREATE TABLE crm_activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id),
  type text NOT NULL,
  summary text,
  details text,
  performed_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE crm_tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id),
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES users(id),
  priority text DEFAULT 'medium',
  due_date date,
  status text DEFAULT 'pending',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE pipeline_stages (
  id serial PRIMARY KEY,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  position int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =======================================================
-- 8. العقود والفواتير
-- =======================================================

CREATE TABLE contracts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id),
  contact_id uuid REFERENCES crm_contacts(id),
  property_id uuid REFERENCES properties(id),
  contract_type text NOT NULL,
  status text DEFAULT 'draft',
  total_amount numeric(15,2),
  pdf_url text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id),
  contact_id uuid REFERENCES crm_contacts(id),
  contract_id uuid REFERENCES contracts(id),
  invoice_type text NOT NULL,
  total_amount numeric(15,2) NOT NULL,
  status text DEFAULT 'draft',
  pdf_url text,
  created_at timestamptz DEFAULT now()
);

-- =======================================================
-- 9. الملفات والإشعارات
-- =======================================================

CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  url text NOT NULL,
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id),
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE integrations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}',
  enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =======================================================
-- الفهارس للأداء
-- =======================================================

-- فهارس المستخدمين
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- فهارس مساحات العمل
CREATE INDEX idx_user_workspaces_workspace_id ON user_workspaces(workspace_id);
CREATE INDEX idx_subscriptions_workspace_id ON subscriptions(workspace_id);

-- فهارس العقارات
CREATE INDEX idx_properties_workspace_id ON properties(workspace_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_property_files_property_id ON property_files(property_id);

-- فهارس الإعلانات
CREATE INDEX idx_listings_workspace_id ON listings(workspace_id);
CREATE INDEX idx_publish_jobs_listing_id ON publish_jobs(listing_id);
CREATE INDEX idx_publish_jobs_status ON publish_jobs(status);

-- فهارس CRM
CREATE INDEX idx_crm_contacts_workspace_id ON crm_contacts(workspace_id);
CREATE INDEX idx_crm_contacts_phone ON crm_contacts(phone);
CREATE INDEX idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX idx_crm_activities_contact_id ON crm_activities(contact_id);
CREATE INDEX idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);

-- فهارس الإشعارات
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- =======================================================
-- بيانات أولية
-- =======================================================

-- إدراج المنصات العقارية السعودية
INSERT INTO platforms (key, name, supports_oauth, supports_api_publish) VALUES
('aqaar', 'عقار', false, true),
('haraj', 'حراج', false, true),
('bayut_ksa', 'بيوت السعودية', false, true),
('dubizzle_ksa', 'دوبيزل السعودية', false, true),
('opensooq_ksa', 'السوق المفتوح', false, true),
('waseety', 'وسِيطي', false, true);

-- مراحل المبيعات الافتراضية
INSERT INTO pipeline_stages (workspace_id, name, position) VALUES
(NULL, 'عميل جديد', 1),
(NULL, 'تم التواصل', 2),
(NULL, 'مؤهل', 3),
(NULL, 'عرض سعر', 4),
(NULL, 'تم الإغلاق', 5);

-- =======================================================
-- نهاية مخطط قاعدة البيانات
-- =======================================================