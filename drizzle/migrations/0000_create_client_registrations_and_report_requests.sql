CREATE TABLE public.client_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.client_registrations TO service_role;

ALTER TABLE public.client_registrations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.report_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  my_kad TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  product TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.report_requests TO service_role;

ALTER TABLE public.report_requests ENABLE ROW LEVEL SECURITY;