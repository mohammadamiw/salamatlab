export type HomeSamplingPayload = Record<string, unknown>;

const SAMPLING_API_URL: string | undefined = import.meta.env.VITE_SAMPLING_API_URL;
const SAMPLING_API_KEY: string | undefined = import.meta.env.VITE_SAMPLING_API_KEY;

export async function submitHomeSamplingRequest(payload: HomeSamplingPayload): Promise<Response> {
  if (!SAMPLING_API_URL) {
    throw new Error('Sampling API URL is not configured (VITE_SAMPLING_API_URL)');
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (SAMPLING_API_KEY) {
    headers['Authorization'] = `Bearer ${SAMPLING_API_KEY}`;
    headers['x-api-key'] = SAMPLING_API_KEY;
  }

  const response = await fetch(SAMPLING_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  return response;
}


