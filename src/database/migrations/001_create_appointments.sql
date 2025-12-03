-- db/migrations/001_create_appointments.sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT, -- meeting | showing | call | ...
  reminder_minutes INT DEFAULT 15,
  reminder_sent BOOLEAN DEFAULT false,
  property_id UUID, -- ربط بعقار
  client_id UUID, -- ربط بعميل
  agent_id UUID, -- ربط بوسيط
  created_by UUID, -- optional user reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_appointments_start_at ON appointments (start_at);
CREATE INDEX idx_appointments_property_id ON appointments (property_id);
CREATE INDEX idx_appointments_client_id ON appointments (client_id);
