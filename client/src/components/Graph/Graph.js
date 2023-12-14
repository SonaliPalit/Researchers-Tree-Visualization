import React, { useEffect, useState } from "react";
import { graph } from "./CreateGraph";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { SigmaContainer, ControlsContainer, ZoomControl, FullScreenControl, SearchControl, 
        useLoadGraph, useRegisterEvents, useSetSettings, useSigma } from "@react-sigma/core";
import { LayoutForceAtlas2Control, useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import "@react-sigma/core/lib/react-sigma.min.css";
import NodeModal from "../Modal/NodeModal";

// Possible node colors for better visualization
const RED = "#b22222";
const GREEN = "#008000";
const GRAY = "#E2E2E2";
const BLUE = "#00FFFF";
const PURPLE = "#A020F0";

// Graph for the searched author
const AuthorGraph = ({ jsonData, name }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDataReady, setIsModalDataReady] = useState(false);
  const [modalContent, setModalContent] = useState({
    label: "",
    size: 0,
    x: 0,
    y: 0,
    author_name: "",
    color: "",
    shared_papers: "",
    count_papers: 0,
    relationships: null
  });
  const [clickedNode, setClickedNode] = useState(null);
  const [newGraph, setNewGraph] = useState(null);

  // Component for the force-directed graph
  const ForceGraph = () => {
    const { assign } = useLayoutForceAtlas2();
    const loadGraph = useLoadGraph();
    const registerEvents = useRegisterEvents();
    const setSettings = useSetSettings();
    const [hoveredNode, setHoveredNode] = useState(null);
    const sigma = useSigma();

    // Load graph and set up event handlers when the component mounts
    useEffect(() => {
      loadGraph(graph);
      console.log("load graph");
      assign();
      console.log(graph);
    }, [loadGraph, assign]);

    // Register event handlers for graph interactions
    useEffect(() => {
      registerEvents({
        clickNode: (event) => {
          console.log("click node");
          setClickedNode(event.node);
          let testModal = graph.getNodeAttributes(event.node);
          testModal.relationships = [
            {type: 'Co-Worker', status: true},
            {type: 'Supervisor', status: true},
            {type: 'Supervisee', status: false},
            {type: 'External', status: false}
          ];
          console.log("here is the updated testModal in clickNode");
          console.log(testModal);
          setModalContent(testModal);
          setIsModalOpen(true);
          setIsModalDataReady(true);
        },
        enterNode: (event) => {
          setHoveredNode(event.node);
          console.log("hoveredNode, enter", hoveredNode);
        },
        leaveNode: () => {
          setHoveredNode(null);
          console.log("hovernode, leave", hoveredNode);
        },
      });
    }, [registerEvents, hoveredNode, sigma]);

    // Set graph rendering settings
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
          return newData;
        },
        edgeReducer: (edge, data) => {
          const graph = sigma.getGraph();
          const newData = { ...data, hidden: false };
          if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
            newData.hidden = true;
          }
          return newData;
        },
      });
    }, [setSettings, hoveredNode, sigma]);

    useEffect(() => {
      if (modalContent.relationships !== null && clickedNode) {
        if (modalContent.relationships[0].type === "Co-Worker" && modalContent.relationships[0].status === true) {
          graph.setNodeAttribute(clickedNode, 'color', BLUE);
        } else if (modalContent.relationships[1].type === "Supervisor" && modalContent.relationships[1].status === true) {
          graph.setNodeAttribute(clickedNode, 'color', RED);
        } else if (modalContent.relationships[2].type === "Supervisee" && modalContent.relationships[2].status === true) {
          graph.setNodeAttribute(clickedNode, 'color', GREEN);
        } else if (modalContent.relationships[3].type === "External" && modalContent.relationships[3].status === true) {
          graph.setNodeAttribute(clickedNode, 'color', PURPLE);
        }
      }
    });
  };

  const saveUpdatedRelationships = (relationships) => {
    modalContent.relationships = relationships
    console.log("this is saveupdatedrelationships in graph for this node:", clickedNode, "with these realtionships", relationships)
    graph.setNodeAttribute(clickedNode, 'relationships', relationships)
  }

    // Handle saving the updated graph
  const handleSaveGraph = () => {
    const updatedGraph = graph.copy();
    const updatedGraphData = [];
    updatedGraph.nodes().forEach((node) => {
      const existingData = updatedGraph.getNodeAttributes(node);
      const newData = { ...existingData };
      if (newData.relationships) {
        console.log(`Updated node ${node}:`, newData.relationships);
      }
      updatedGraphData.push({
        author_name: newData.author_name,
        relationships: newData.relationships,
      });
      updatedGraph.replaceNodeAttributes(node, newData);
    });
    setNewGraph(updatedGraph);
    sendUpdatedGraphData(updatedGraphData);
  };

  // Send the updated graph data to the backend
  const sendUpdatedGraphData = (updatedGraphData) => {
    fetch('http://localhost:1234/api/updateGraph', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedGraphData),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
      })
      .catch(error => {
        console.error('Error updating graph:', error);
      });
  };

  // Track the newGraph whenever it changes
  useEffect(() => {
    if (newGraph) {
      console.log("New Graph:", newGraph);
    }
  }, [newGraph]);

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
      {isModalDataReady && (
          <NodeModal
            isOpen={isModalOpen}
            closeModal={() => setIsModalOpen(false)}
            modalContent={modalContent}
            setRelationships={saveUpdatedRelationships}
            name={name}
          />
        )}
      <button onClick={handleSaveGraph}>Save Graph</button>
    </div>
  );
};

export default AuthorGraph;