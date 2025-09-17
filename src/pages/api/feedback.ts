export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    // در محیط واقعی: ذخیره در دیتابیس و/یا ارسال ایمیل
    const body = req.body;
    res.status(200).json({ success: true, received: body });
  } catch (e) {
    res.status(500).json({ error: 'server error' });
  }
}


