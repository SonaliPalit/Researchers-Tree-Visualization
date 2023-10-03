import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import FullGraph from './FullGraph'

function App() {
  const [allData, setAllData] = useState([])
  const [data, setData] = useState([]); //to retrieve from query
  const [authorNameInput, setAuthorName] = useState('')

  const handleFullGraph =  () => {
    fetch(`http://localhost:1234/api`)
    .then((response) => response.json())
    .then((data) => setAllData(data))
    .catch((error) => console.error('Error fetching data:', error));

  }

  const fullGraphVis = () => {
    return (
      <div>
      {allData.length > 0 && <FullGraph jsonData = {allData} /> }
      </div>
    );
  }


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
        {/* dont display anything if data not yet filled */}
        {data.length > 0 && <Graph jsonData={data} name={authorNameInput} />} 
      </div>
    );
  }

  return (
    <div>

      <input type="text" placeholder="Enter author name" value={authorNameInput} onChange={handleInputChange} />
      <button onClick={handleSubmitAuthor}>Search</button>

      <button onClick={handleFullGraph}>FullGraph</button>
      {fullGraphVis()}
      {graphVis()}
      
      {/* <ol>
      {data.map((user) => (
        <li>
          <strong>Author Name: </strong> {user.author_name}{'\n'}
          <strong> Co_Author: </strong> {user.co_author}
          <strong> Paper Doi: </strong> {user.shared_paper_ids} {'\n'}
          <strong> Count of Papers: </strong> {user.co_authorship_count} {'\n'}
        </li>       
      ))}
       
    </ol> */}

    {/* <button onClick={handleVis}>Visualize!</button> */}
  
    </div>


  );
}

export default App;
