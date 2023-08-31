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
//use self-joins - t1,t2
app.get('/api/author', (req, res) => {
  const authorName = req.query.name;
  const query = `
  SELECT a1.author_names AS author_name,
  a2.author_names AS co_author,
  a2.Affiliation AS affiliation,
  GROUP_CONCAT(DISTINCT a1.paper_doi ) AS shared_paper_ids,
  COUNT(DISTINCT a1.paper_doi) AS co_authorship_count
  FROM author_paper_position_affiliation a1
  JOIN author_paper_position_affiliation a2 ON a1.paper_doi = a2.paper_doi
  WHERE a1.author_names = ? AND a2.author_names <> ?
  GROUP BY a1.author_names, a2.author_names;
  `;
  
  db.all(query, [authorName, authorName], (err, rows) => {
      if (err) {
      res.status(500).json({ error: err.message });
      } else {
      res.json(rows);
      }
  });
});


// app.get('/api/author', (req, res) => {
//     const authorName = req.query.name;
  
//     db.all('SELECT DISTINCT t2.author_names, t2.paper_doi, t2. affiliation FROM author_paper_position_affiliation t1 JOIN author_paper_position_affiliation t2 ON t1.paper_doi = t2.paper_doi WHERE t1.author_names = ? AND t2.author_names <> ? ;', [authorName, authorName], (err, rows) => {
//         if (err) {
//         res.status(500).json({ error: err.message });
//         } else {
//         res.json(rows);
//         }
//     });
//   });

  // app.get('/api', (req, res) => {
  //   const authorName = req.query.name;
  
  //   db.all('SELECT DISTINCT t2.author_names, t2.paper_doi, t2. affiliation FROM author_paper_position_affiliation t1 JOIN author_paper_position_affiliation t2 ON t1.paper_doi = t2.paper_doi;', (err, rows) => {
  //       if (err) {
  //       res.status(500).json({ error: err.message });
  //       } else {
  //       res.json(rows);
  //       }
  //   });
  // });

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

