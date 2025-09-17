export async function sendSms(phone: string, message: string): Promise<boolean> {
  const SMS_API_URL: string | undefined = import.meta.env.VITE_SMS_API_URL;
  const SMS_API_KEY: string | undefined = import.meta.env.VITE_SMS_API_KEY || import.meta.env.VITE_SAMPLING_API_KEY;
  if (!SMS_API_URL || !SMS_API_KEY) return false;

  try {
    const res = await fetch(SMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMS_API_KEY}`,
        'x-api-key': SMS_API_KEY,
      },
      body: JSON.stringify({ to: phone, message }),
    });
    return res.ok;
  } catch {
    return false;
  }
}


