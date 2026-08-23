export const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get('Origin');
  const allowedOriginsStr = Deno.env.get('ALLOWED_ORIGINS') || '';
  const allowedOrigins = allowedOriginsStr.split(',').map(o => o.trim());
  
  // Safe default: only allow specific origin, or fallback to restrictive if empty
  // Allows localhost for local development
  const isAllowed = origin && (
    origin.startsWith('http://localhost:') || 
    origin.startsWith('http://127.0.0.1:') || 
    allowedOrigins.includes(origin)
  );

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'https://arinova.app',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
  };
};
