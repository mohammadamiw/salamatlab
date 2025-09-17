export const getApiBase = (): string => {
  // Prefer same-origin for production behind reverse proxy
  if (import.meta.env.PROD) return '';
  // For local dev you can target PHP public folder via Vite proxy or absolute path
  return '';
};


