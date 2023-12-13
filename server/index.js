const express = require('express');
const cors = require('cors');

// Database Initialization
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.db');

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint to handle getting author data
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

// Endpoint to handle getting all data
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

// Endpoint to handle updating nodes and relationships in the database
// Change this to reflect updated DB model
app.post('/api/updateGraph', (req, res) => {
  const updatedGraphData = req.body;
  updatedGraphData.forEach((nodeData) => {
    const { author_names, position_number, position_code, affiliation, relationships } = nodeData;
    const updateNodeQuery = `
      UPDATE relationship
      WHERE author = "Petra Isenberg"
      and co_author = "Natkamon Tonavich"
      SET type = "Ph.D student"
    `;
    db.run(updateNodeQuery);
  });
});

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});