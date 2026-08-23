export function sanitizeUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  
  // Trim whitespace
  const trimmed = url.trim();
  
  // Allow only http://, https://, or mailto:
  // If it starts with anything else (including javascript:, data:, vbscript:), reject or prefix
  if (trimmed.toLowerCase().startsWith('javascript:') || 
      trimmed.toLowerCase().startsWith('data:') || 
      trimmed.toLowerCase().startsWith('vbscript:')) {
    return 'about:blank';
  }
  
  // If it doesn't start with http/https/mailto, assume it's a domain and prefix with https://
  if (!trimmed.toLowerCase().startsWith('http://') && 
      !trimmed.toLowerCase().startsWith('https://') && 
      !trimmed.toLowerCase().startsWith('mailto:')) {
    return `https://${trimmed}`;
  }
  
  return trimmed;
}
