let visitorCount = 0;

export default function handler(req, res) {
  if (req.method === 'POST') {
    visitorCount += 1;
    res.status(200).json({ count: visitorCount });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
