let visitorsCount = 0;

export default function handler(req, res) {
  if (req.method === 'GET') {
    visitorsCount += 1;
    res.status(200).json({ count: visitorsCount });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
