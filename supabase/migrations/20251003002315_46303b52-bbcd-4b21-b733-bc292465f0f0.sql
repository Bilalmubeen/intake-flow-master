-- Create table for client intake records
CREATE TABLE IF NOT EXISTS public.client_intakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  organization_name TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  workflow_state TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for user lookups
CREATE INDEX idx_client_intakes_user_id ON public.client_intakes(user_id);
CREATE INDEX idx_client_intakes_workflow_state ON public.client_intakes(workflow_state);

-- Enable Row Level Security
ALTER TABLE public.client_intakes ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own intakes" 
ON public.client_intakes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own intakes" 
ON public.client_intakes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intakes" 
ON public.client_intakes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own intakes" 
ON public.client_intakes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create table for audit log
CREATE TABLE IF NOT EXISTS public.intake_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intake_id UUID NOT NULL REFERENCES public.client_intakes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  section TEXT,
  changes JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for audit lookups
CREATE INDEX idx_audit_intake_id ON public.intake_audit_log(intake_id);
CREATE INDEX idx_audit_timestamp ON public.intake_audit_log(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE public.intake_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies for audit log
CREATE POLICY "Users can view audit logs for their intakes" 
ON public.intake_audit_log 
FOR SELECT 
USING (
  intake_id IN (
    SELECT id FROM public.client_intakes WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create audit log entries" 
ON public.intake_audit_log 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create table for admin-managed dropdowns
CREATE TABLE IF NOT EXISTS public.admin_dropdown_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  list_name TEXT NOT NULL,
  option_value TEXT NOT NULL,
  option_label TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(list_name, option_value)
);

-- Create index for dropdown lookups
CREATE INDEX idx_dropdown_list_name ON public.admin_dropdown_options(list_name, sort_order);

-- Enable Row Level Security
ALTER TABLE public.admin_dropdown_options ENABLE ROW LEVEL SECURITY;

-- Create policies for dropdown options (public read, admin write)
CREATE POLICY "Anyone can view dropdown options" 
ON public.admin_dropdown_options 
FOR SELECT 
USING (true);

-- Seed initial dropdown data
INSERT INTO public.admin_dropdown_options (list_name, option_value, option_label, sort_order) VALUES
('account_managers', 'murshid', 'Murshid', 1),
('account_managers', 'bisma', 'Bisma', 2),
('account_managers', 'sarah', 'Sarah', 3),
('billing_leads', 'staff_1', 'Staff Member 1', 1),
('billing_leads', 'staff_2', 'Staff Member 2', 2),
('billing_leads', 'staff_3', 'Staff Member 3', 3),
('practice_facilities', 'practice_1', 'Practice 1', 1),
('practice_facilities', 'practice_2', 'Practice 2', 2),
('practice_facilities', 'practice_3', 'Practice 3', 3)
ON CONFLICT (list_name, option_value) DO NOTHING;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_client_intakes_updated_at
BEFORE UPDATE ON public.client_intakes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();