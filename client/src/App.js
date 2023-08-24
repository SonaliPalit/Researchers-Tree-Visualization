import React, { useState, useEffect } from 'react';
import Graph from './Graph';

function App() {
  const [data, setData] = useState([]); //to retrieve from query
  const [authorNameInput, setAuthorName] = useState('')
  const [visFunc, setVisData] = useState('') //hook for graph function


  const handleInputChange = (event) => {
    setAuthorName(event.target.value);
  };

  const handleSubmit = () => {
    fetch(`http://localhost:1234/api/author?name=${encodeURIComponent(authorNameInput)}`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  };
  const graphVis =  () => {
    return (
      <div>
      <Graph jsonData = {data} name = {authorNameInput} />
      </div>
    );
  }

  const handleVis = () => {
    setVisData(graphVis)
  }


  return (
    <div>
      <h1>Author List</h1>

      <input type="text" placeholder="Enter author name" value={authorNameInput} onChange={handleInputChange} />
      <button onClick={handleSubmit}>Search</button>
      <ul>
      {data.map((user) => (
        <li>
          <strong>Name: </strong> {user.author_names}{'\n'}
          <strong> Paper Doi: </strong> {user.paper_doi} {'\n'}
          <strong> Affiliation: </strong> {user.Affiliation} {'\n'}

        </li>       
      ))}
       
    </ul>
    <button onClick={handleVis}>Visualize!</button>
    {visFunc}
  
    </div>


  );
}

export default App;
