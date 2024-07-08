// pages/api/visitor-count.js
export default async function handler(req, res) {
  const measurementId = 'G-380HYREED6';
  const apiSecret = 'hfo3v2u-QaOi5zrvXLxWUQ';
  
  try {
    const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        events: [{
          name: 'page_view',
          params: {
            page_location: req.headers.referer || 'http://localhost',
          },
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json({ count: data });
  } catch (error) {
    console.error('Error logging page view:', error);
    res.status(500).json({ error: 'Error logging page view' });
  }
}
