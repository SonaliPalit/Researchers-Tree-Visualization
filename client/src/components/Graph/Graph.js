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

// Graph for the searched author
const AuthorGraph = ({ jsonData, name }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    label: "",
    size: 0,
    x: 0,
    y: 0,
    author_name: "",
    color: "",
    shared_papers: "",
    count_papers: 0,
    selectedOption: "",
  });
  const [selectedOption, setSelectedOption] = useState(null);
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
          setSelectedOption(null);
          setModalContent(graph.getNodeAttributes(event.node));
          setIsModalOpen(true);
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

    // Update node color based on selected option
    useEffect(() => {
      if (selectedOption) {
        if (selectedOption === "PhD Student") {
          graph.setNodeAttribute(clickedNode, 'color', BLUE);
          console.log("selescted option blue");
        } else if (selectedOption === "Associate Professor") {
          graph.setNodeAttribute(clickedNode, 'color', RED);
        } else if (selectedOption === "Post Graduate Researcher") {
          graph.setNodeAttribute(clickedNode, 'color', GREEN);
        }
      }
    });

    // Handle selected option changes
    useEffect(() => {
      if (selectedOption && clickedNode) {
        // Clone the original graph to avoid modifying it directly
        const updatedGraph = graph.copy();
        // Apply the edited relationship type to the clicked node
        updatedGraph.setNodeAttribute(clickedNode, 'editedRelationshipType', selectedOption);
        // Save the updated graph to state
        setNewGraph(updatedGraph);
      }
    }, [selectedOption, clickedNode]);

    return null;
  };

  // Handle saving the updated graph
  const handleSaveGraph = () => {
    // Clone the original graph to avoid modifying it directly
    const updatedGraph = graph.copy();
    // Iterate over the nodes and update the data
    updatedGraph.nodes().forEach((node) => {
      const existingData = updatedGraph.getNodeAttributes(node);
      const newData = { ...existingData };
      // Check if the node has an edited relationship type
      if (newData.editedRelationshipType) {
        // Apply the edited relationship type
        newData.relationshipType = newData.editedRelationshipType;
        // Clear the editedRelationshipType field
        delete newData.editedRelationshipType;
        // Log the updated node's ID and data
        console.log(`Updated node ${node}:`, newData);
      }
      // Save the updated data back to the graph
      updatedGraph.replaceNodeAttributes(node, newData);
    });
    // Save the updated graph to state
    setNewGraph(updatedGraph);
  };

  // Log the newGraph whenever it changes
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
      <NodeModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        modalContent={modalContent}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        name={name}
      />
      <button onClick={handleSaveGraph}>Save Graph</button>
    </div>
  );
};

export default AuthorGraph;