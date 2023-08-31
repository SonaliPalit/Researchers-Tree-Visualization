import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import FullGraph from './FullGraph'

function App() {
  const [allData, setAllData] = useState([])
  const [data, setData] = useState([]); //to retrieve from query
  const [authorNameInput, setAuthorName] = useState('')
  const [visFunc, setVis] = useState('') //hook for graph function
  const [fullVisFunc, fullSetVis] = useState('') //hook for graph function


  const handleInputChange = (event) => {
    setAuthorName(event.target.value);
  };

  const handleSubmitAuthor = () => {
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
  const fullGraphVis =  () => {
    fetch(`http://localhost:1234/api`)
    .then((response) => response.json())
    .then((data) => setAllData(data))
    .catch((error) => console.error('Error fetching data:', error));

    return (
      <div className = "graph-container">
      <FullGraph jsonData = {allData}  />
      </div>
    );
  }

  const handleVis = () => {
    setVis(graphVis)
  }


  return (
    <div>
    

      <input type="text" placeholder="Enter author name" value={authorNameInput} onChange={handleInputChange} />
      <button onClick={handleSubmitAuthor}>Search</button>
      <ol>
      {data.map((user) => (
        <li>
          <strong>Author Name: </strong> {user.author_name}{'\n'}
          <strong> Co_Author: </strong> {user.co_author}
          <strong> Paper Doi: </strong> {user.shared_paper_ids} {'\n'}
          <strong> Count of Papers: </strong> {user.co_authorship_count} {'\n'}
        </li>       
      ))}
       
    </ol>

    <button onClick={handleVis}>Visualize!</button>
    {visFunc}
  
    </div>


  );
}

export default App;
