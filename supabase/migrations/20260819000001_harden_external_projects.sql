ALTER TABLE public.external_projects ADD COLUMN IF NOT EXISTS is_deleted boolean not null default false;

CREATE OR REPLACE FUNCTION public.enforce_external_project_xp()
RETURNS trigger AS $$
DECLARE
  lang_bytes int := 0;
  total_bytes int := 0;
  calculated_xp int := 0;
  lang_key text;
  lang_val jsonb;
BEGIN
  IF NEW.provider = 'github' AND NEW.metadata ? 'languages' THEN
    FOR lang_key, lang_val IN SELECT * FROM jsonb_each(NEW.metadata->'languages') LOOP
      total_bytes := total_bytes + (lang_val#>>'{}')::int;
    END LOOP;
    
    IF total_bytes < 1000 THEN
      calculated_xp := 10;
    ELSIF total_bytes < 10000 THEN
      calculated_xp := 50;
    ELSE
      calculated_xp := 150;
    END IF;

    IF NEW.xp_awarded > calculated_xp THEN
      NEW.xp_awarded := calculated_xp;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_external_project_xp ON public.external_projects;
CREATE TRIGGER trg_enforce_external_project_xp
BEFORE INSERT OR UPDATE ON public.external_projects
FOR EACH ROW EXECUTE FUNCTION public.enforce_external_project_xp();
