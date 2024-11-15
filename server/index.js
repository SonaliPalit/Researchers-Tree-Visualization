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

//req is used to access information from the incoming HTTP request, 
//and res is used to send an HTTP response back to the client based on the results of your database query.

app.get('/api/author', (req, res) => {
  const authorName = req.query.name;
  const ego_net_query = `
  SELECT  author1, author2,  COUNT(paper_doi) AS count_paper
  FROM (SELECT a1.author_names AS author1, a2.author_names AS author2, a1.paper_doi
    FROM author_paper_position_affiliation a1
    JOIN author_paper_position_affiliation a2 ON a1.paper_doi = a2.paper_doi
    WHERE a2.author_names > a1.author_names
    )
    WHERE paper_doi IN (
    SELECT paper_doi FROM author_paper_position_affiliation 
    WHERE author_names = ?)
    GROUP BY author1, author2
  `
  
  db.all(ego_net_query, [authorName], (err, rows) => {
      if (err) {
      res.status(500).json({ error: err.message });
      } else {
      res.json(rows);
      }
  });
});

//Get URL for all data
app.get('/api', (req, res) => {
    const query = `
      SELECT  author1, author2,  COUNT(paper_doi) AS count_paper
      FROM (SELECT a1.author_names AS author1, a2.author_names AS author2, a1.paper_doi
      FROM author_paper_position_affiliation a1
      JOIN author_paper_position_affiliation a2 ON a1.paper_doi = a2.paper_doi
      WHERE a2.author_names > a1.author_names
      )
      WHERE paper_doi IN (
      SELECT paper_doi FROM author_paper_position_affiliation )
      GROUP BY author1, author2
    `;

    db.all(query, (err, rows) => {
      if (err) {
      res.status(500).json({ error: err.message });
      } else {
      res.json(rows);
      }
  });


});

// const query = `
// SELECT a1.author_names AS author_name,
// a2.author_names AS co_author,
// a2.Affiliation AS affiliation,
// GROUP_CONCAT(DISTINCT a1.paper_doi ) AS shared_paper_ids,
// COUNT(DISTINCT a1.paper_doi) AS co_authorship_count
// FROM author_paper_position_affiliation a1
// JOIN author_paper_position_affiliation a2 ON a1.paper_doi = a2.paper_doi
// WHERE a1.author_names = ? AND a2.author_names <> ?
// GROUP BY a1.author_names, a2.author_names;
// `;



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


const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

