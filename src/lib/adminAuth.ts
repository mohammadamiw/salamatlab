export const getAdminAuthHeader = (): string | null => {
	try {
		const user = localStorage.getItem('admin_user') || '';
		const pass = localStorage.getItem('admin_pass') || '';
		if (!user || !pass) return null;
		return 'Basic ' + btoa(`${user}:${pass}`);
	} catch {
		return null;
	}
};

export const setAdminCredentials = (username: string, password: string): void => {
	localStorage.setItem('admin_user', username);
	localStorage.setItem('admin_pass', password);
};

export const clearAdminCredentials = (): void => {
	localStorage.removeItem('admin_user');
	localStorage.removeItem('admin_pass');
};

export const isAdminAuthenticated = (): boolean => {
	return getAdminAuthHeader() !== null;
};

export type AdminCreds = { user: string; pass: string };

const STORAGE_KEY = 'salamat_admin_creds_v1';

export function saveAdminCreds(creds: AdminCreds) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
}

export function clearAdminCreds() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getAdminCreds(): AdminCreds | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.user === 'string' && typeof parsed.pass === 'string') {
      return parsed as AdminCreds;
    }
  } catch {}
  return null;
}

export function buildAuthHeader(creds: AdminCreds | null): Record<string, string> {
  if (!creds) return {};
  const token = btoa(`${creds.user}:${creds.pass}`);
  return { Authorization: `Basic ${token}` };
}


