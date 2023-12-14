import Graph from "graphology";
import "@react-sigma/core/lib/react-sigma.min.css";

const ORANGE = "#ff7f50";
const GRAY = "#E2E2E2";
const jsonData = JSON.parse(localStorage.getItem("authorData"))
// const response = await fetch('http://localhost:1234/api');
// const jsonData = await response.json();
// console.log(jsonData);

export const graph = new Graph();
let count = 0
let authors = new Set();
console.log("start graph")

jsonData.forEach((user) => {
    if (!(authors.has(user.author1))){
      count++
      graph.addNode(user.author1, {
        label: user.author1,
        size: 20,
        x: count + 12,
        y: count + 10,
        author_name: user.author1,
        color: ORANGE,
        count_papers : user.count_paper,
        relationships: user.relationships
      });
      authors.add(user.author1) 
    }
    if (!(authors.has(user.author2))){
      count++
      graph.addNode(user.author2, {
        label: user.author2,
        size: 20,
        x: count + 12,
        y: count + 10,
        author_name: user.author2,
        color: ORANGE,
        count_papers : user.count_paper,
        relationships: user.relationships
      });
      authors.add(user.author2) 
    }
    graph.addEdge(user.author1, user.author2, {color: GRAY, size: user.count_paper * 1.25})
})