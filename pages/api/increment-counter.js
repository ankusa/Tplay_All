import mysql from 'mysql';

// Configure MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL database.');
});

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Increment visitor count in database
    connection.query('UPDATE visitor_counts SET count = count + 1', (err, result) => {
      if (err) {
        console.error('Error updating visitor count:', err);
        res.status(500).json({ error: 'Failed to increment visitor count.' });
        return;
      }

      // Fetch updated visitor count
      connection.query('SELECT count FROM visitor_counts', (err, rows) => {
        if (err) {
          console.error('Error fetching visitor count:', err);
          res.status(500).json({ error: 'Failed to fetch visitor count.' });
          return;
        }

        const visitorCount = rows[0].count;
        res.status(200).json({ count: visitorCount });
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
