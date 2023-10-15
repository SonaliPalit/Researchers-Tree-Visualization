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
import {graph} from "./CreateGraph";
Modal.setAppElement('#root')



const RED = "#b22222";
const ORANGE = "#ff7f50";
const GRAY = "#E2E2E2";


const AuthorGraph = ({jsonData, name}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({label : "", size: 0, x : 0, y: 0, author_name: "", color: "", shared_papers : "", count_papers: 0});
    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        width: 400,
      },
    };

    const ForceGraph = () => {
      const { positions, assign } = useLayoutForceAtlas2();
      const loadGraph = useLoadGraph();
      const registerEvents = useRegisterEvents();
    
      const setSettings = useSetSettings();
      const [hoveredNode, setHoveredNode] = useState(null);
      const sigma = useSigma();
    
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [modalContent, setModalContent] = useState({label : "", size: 0, x : 0, y: 0, author_name: "", color: "", shared_papers : "", count_papers: 0});
      
    
      useEffect(() => {
    
          loadGraph(graph);
          console.log("load graph")
          assign();
          console.log(graph)
    
          registerEvents({
            clickNode: (event) => {
              console.log("click node")
              const clickedNode = event.node;
              setModalContent(graph.getNodeAttributes(clickedNode));
              setIsModalOpen(true);
              
              
            },
            enterNode: (event) => {
              setHoveredNode(event.node)
              console.log("hoveredNode, enter", hoveredNode)
             
              
            },
            leaveNode: () => {
              setHoveredNode(null)
              console.log("hovernode, leave", hoveredNode)
              
            },
    
          });
        }, [assign, loadGraph, registerEvents, hoveredNode, sigma]);
    
        useEffect(() => {
          setSettings({
            nodeReducer: (node, data) => {
              const graph = sigma.getGraph();
              const newData = { ...data, highlighted: data.highlighted || false };
      
              if (hoveredNode) {
                if (node === hoveredNode || graph.neighbors(hoveredNode).includes(node)) {
                  newData.highlighted = true;
                  newData.color = RED;
                } else {
                  newData.color = GRAY;
                  newData.highlighted = false;
                }
              }
              // if (hoveredEdgeConnectedNodes && hoveredEdgeConnectedNodes.includes(node)) { // Check if the node is connected to the hovered edge
              //   newData.highlighted = true;
              //   newData.color = RED; // Set the color for connected nodes
              // }
              return newData;
            },
            edgeReducer: (edge, data) => {
              const graph = sigma.getGraph();
              const newData = { ...data, hidden: false};
              // console.log(data)
      
              if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
                newData.hidden = true;
              }
              // if (hoveredEdge){
              //   if (edge === hoveredEdge) {
              //     newData.color = RED; 
              //   } 
              // }
    
              return newData;
            }
          });
        }, [setSettings, hoveredNode, sigma])
    
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
      <Modal isOpen = {isModalOpen} onRequestClose={() => setIsModalOpen(false)} style={customStyles}>
        <h2>Info</h2>
        <div> <p> Author Name : {modalContent.label} </p>
              <p>No. of papers shared with {name} : {modalContent.count_papers}</p>
         </div>
        <button onClick={() => setIsModalOpen(false)}>Close</button>

      </Modal>


    </div>
  );
   
};

export default AuthorGraph;