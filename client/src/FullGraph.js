import React, { useEffect, useState } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { SigmaContainer, ControlsContainer, ZoomControl, FullScreenControl, SearchControl, useLoadGraph, useRegisterEvents, useSetSettings, useSigma } from "@react-sigma/core";
import { LayoutForceAtlas2Control, useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import "@react-sigma/core/lib/react-sigma.min.css";
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import Modal from "react-modal";
Modal.setAppElement('#root')



const RED = "#b22222";
const ORANGE = "#ff7f50";
const GRAY = "#E2E2E2";


const FullGraph = ({jsonData}) => {

    const ForceGraph = () => {
        const { positions, assign } = useLayoutForceAtlas2();
        const loadGraph = useLoadGraph();
        const registerEvents = useRegisterEvents();

        const setSettings = useSetSettings();
        const [hoveredNode, setHoveredNode] = useState(null);
        const sigma = useSigma();
        
      

        useEffect(() => {
            const graph = new Graph();
            let count = 0
            let authors = new Set();
            
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
                    // shared_papers: user.shared_paper_ids,
                    // affiliation: user.affiliation, 
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
                    // shared_papers: user.shared_paper_ids,
                    // affiliation: user.affiliation, 
                  });
                  authors.add(user.author2) 
                }
                graph.addEdge(user.author1, user.author2, {color: GRAY ,size : user.count_paper})
            })

            // registerEvents({
            //   clickNode: (event) => {
            //     console.log("click node")
                
            //   },
            //   enterNode: (event) => {
            //     setHoveredNode(event.node)
            //     console.log("hoveredNode, enter", hoveredNode)
               
                
            //   },
            //   leaveNode: () => {
            //     setHoveredNode(null)
            //     console.log("hovernode, leave", hoveredNode)
                
            //   },

            // });

            loadGraph(graph);
            positions()
            assign();
          // }, [assign, loadGraph, positions, registerEvents, hoveredNode, sigma]);
        }, [assign, loadGraph, positions, registerEvents]);

          // useEffect(() => {
          //   setSettings({
          //     nodeReducer: (node, data) => {
          //       const graph = sigma.getGraph();
          //       const newData = { ...data, highlighted: data.highlighted || false };
        
          //       if (hoveredNode) {
          //         if (node === hoveredNode || graph.neighbors(hoveredNode).includes(node)) {
          //           newData.highlighted = true;
          //           newData.color = RED;
          //         } else {
          //           newData.color = GRAY;
          //           newData.highlighted = false;
          //         }
          //       }
          //       // if (hoveredEdgeConnectedNodes && hoveredEdgeConnectedNodes.includes(node)) { // Check if the node is connected to the hovered edge
          //       //   newData.highlighted = true;
          //       //   newData.color = RED; // Set the color for connected nodes
          //       // }
          //       return newData;
          //     },
          //     edgeReducer: (edge, data) => {
          //       const graph = sigma.getGraph();
          //       const newData = { ...data, hidden: false};
          //       // console.log(data)
        
          //       if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
          //         newData.hidden = true;
          //       }
          //       // if (hoveredEdge){
          //       //   if (edge === hoveredEdge) {
          //       //     newData.color = RED; 
          //       //   } 
          //       // }
  
          //       return newData;
          //     }
          //   });
          // }, [setSettings, hoveredNode, sigma])

    return null;
    };

  return (
    <div>
      <SigmaContainer
        style={{ height: "800px", width: "1500px" }}
        settings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          defaultNodeType: "image",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 15,
          labelFont: "Lato, sans-serif",
          zIndex: true,
        }}
      >
        <ControlsContainer position={"bottom-left"}>
          <ZoomControl />
          <FullScreenControl />
          <LayoutForceAtlas2Control />
        </ControlsContainer>
        <ControlsContainer position={"top-left"}>
          <SearchControl style={{ width: "200px" }} />
        </ControlsContainer>
        <ForceGraph />
      </SigmaContainer>

    </div>
  );
   
};

export default FullGraph;