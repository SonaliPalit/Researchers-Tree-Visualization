const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const client = require("./db");

// Endpoint to handle getting all data
app.get('/', async (req, res) => {
  try {
    await client.connect();
    console.log("Connected!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to handle getting all data
app.get('/api', async (req, res) => {
  try {
    const query = `
      SELECT
        author1,
        author2,
        COUNT(paper_doi) AS count_paper
      FROM (
        SELECT
          a1.author_names AS author1,
          a2.author_names AS author2,
          a1.paper_doi
        FROM
          author_paper_position_affiliation a1
        JOIN
          author_paper_position_affiliation a2 ON a1.paper_doi = a2.paper_doi
        WHERE
          a2.author_names > a1.author_names
      ) AS subquery
      WHERE
        paper_doi IN (
          SELECT paper_doi FROM author_paper_position_affiliation
        )
      GROUP BY
        author1, author2
    `;

    const result = await client.query(query);
    const data = result.rows;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Author endpoint
app.get('/api/author', async (req, res) => {
  try {
    const authorName = req.query.name;
    const ego_net_query = `
      SELECT
        author1,
        author2,
        COUNT(paper_doi) AS count_paper
      FROM (
        SELECT
          a1.author_names AS author1,
          a2.author_names AS author2,
          a1.paper_doi
        FROM
          author_paper_position_affiliation a1
        JOIN
          author_paper_position_affiliation a2 ON a1.paper_doi = a2.paper_doi
        WHERE
          a2.author_names > a1.author_names
      ) AS subquery
      WHERE
        paper_doi IN (
          SELECT paper_doi FROM author_paper_position_affiliation WHERE author_names = $1
        )
      GROUP BY
        author1, author2
    `;

    const result = await client.query(ego_net_query, [authorName]);
    const data = result.rows;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to handle updating nodes and relationships in the database
// Change this to reflect the updated DB model
app.post('/api/updateGraph', async (req, res) => {
  try {
    await client.connect();
    console.log("Connected!");

    const updatedGraphData = req.body;
    updatedGraphData.forEach(async (nodeData) => {
      const { author_names, position_number, position_code, affiliation, relationships } = nodeData;
      const updateNodeQuery = `
        UPDATE relationship
        SET type = 'Ph.D student'
        WHERE author = $1
        AND co_author = $2
      `;

      await client.query(updateNodeQuery, ["Petra Isenberg", "Natkamon Tonavich"]);
    });

    res.send("Graph updated successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});