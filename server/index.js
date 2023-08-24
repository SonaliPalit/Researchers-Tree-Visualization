const express = require('express');
const cors = require('cors');

//Database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.db');

const app = express();
app.use(express.json());
app.use(cors());


//create a route to handle incoming requests to our Express application at the path /api/author_paper
// app.get('/api', (request, response) => {
//     response.send('Hello world from Express!');
// });

//Endpoint that queries sqlite database and sends the data to the front end as json
app.get('/api/author', (req, res) => {
    const authorName = req.query.name;
  
    db.all('SELECT DISTINCT t2.author_names, t2.paper_doi, t2. affiliation FROM author_paper_position_affiliation t1 JOIN author_paper_position_affiliation t2 ON t1.paper_doi = t2.paper_doi WHERE t1.author_names = ? AND t2.author_names <> ? ;', [authorName, authorName], (err, rows) => {
        if (err) {
        res.status(500).json({ error: err.message });
        } else {
        res.json(rows);
        }
    });
  });

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//let storedName = ""
// app.post('/api/set_author_name', (req, res) => {
//     const { name } = req.body;
//     if (name) {
//       storedName = name;
//       res.json({ message: `Successfully stored name: ${storedName}` });
//     } else {
//       res.status(400).json({ error: 'Name is required' });
//     }
//   });

// app.get('/api/author', (req, res) => {
//   db.all('SELECT DISTINCT t2.author_names, t2.paper_doi, t2. affiliation FROM author_paper_position_affiliation t1 JOIN author_paper_position_affiliation t2 ON t1.paper_doi = t2.paper_doi WHERE t1.author_names = ? AND t2.author_names <> "Kelly Pennock";', [storedName], (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//     } else {
//       res.json(rows);
//     }
//   });
// });