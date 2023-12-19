import Graph from "graphology";
import "@react-sigma/core/lib/react-sigma.min.css";
// import { json } from "body-parser";

const GREEN = "#c9cba3";
const YELLOW = "#ffe1a8";
const RED = "#e26d5c";
const MAROON = "#723d46";
const BROWN = "#472d30";

const GRAY = "#D3D3D3"

const jsonData = JSON.parse(localStorage.getItem("authorData"))
const relationshipData = JSON.parse(localStorage.getItem("relationshipData"))

// const response = await fetch('http://localhost:1234/api/author?name=Petra+Isenberg');
// const jsonData = await response.json();
// console.log(jsonData);

// const res = await fetch('http://localhost:1234/api/relationships?name=Petra+Isenberg');
// const relationshipData = await res.json();
// console.log(relationshipData);

export const graph = new Graph();
let count = 0
let authors = new Set();
console.log("start graph")

const setColor = (relationship) => {
  if (relationship === 'Supervisee') return YELLOW;
  else if(relationship === 'Supervisor') return MAROON;
  else if (relationship === 'Co-worker') return GREEN;
  else if (relationship === 'External') return RED;
  else return GREEN;
}

const authorName = relationshipData[0]['Author']
graph.addNode(authorName, {
  label: authorName,
      size: 20,
      x: count + 12,
      y: count + 10,
      author_name: authorName,
      color: BROWN,
      relationship: 'self'
})
authors.add(authorName) 

relationshipData.forEach((user) => {
  if (!(authors.has(user['Co-author']))){
    count++
    graph.addNode(user['Co-author'], {
      label: user['Co-author'],
      size: 20,
      x: count + 12,
      y: count + 10,
      author_name: user['Co-author'],
      color: setColor(user['Type']),
      relationship: user['Type']
    });
    authors.add(user['Co-author']) 
  }
})

jsonData.forEach((user) => {
    graph.addEdge(user.author1, user.author2, {color: GRAY ,size : user.count_paper*1.25})
})