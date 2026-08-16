DROP TRIGGER IF EXISTS trigger_auto_assign_identity ON public.profiles;

CREATE TRIGGER trigger_auto_assign_identity
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_identity();
