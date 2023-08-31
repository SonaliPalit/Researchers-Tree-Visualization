import React, { useEffect, useState } from "react";
import Graph from "graphology";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { SigmaContainer, ControlsContainer, ZoomControl, FullScreenControl, SearchControl, useLoadGraph } from "@react-sigma/core";
import { LayoutForceAtlas2Control, useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import "@react-sigma/core/lib/react-sigma.min.css";


const DemoGraph = ({jsonData, name}) => {
    const ForceGraph = () => {
        const { positions, assign } = useLayoutForceAtlas2();
        const loadGraph = useLoadGraph();

        useEffect(() => {
            
            const graph = new Graph();
            let count = 0
            graph.addNode(count, {
                label: name,
                 size: 10,
                x: 0,
                y: 0,
            });
            
            jsonData.forEach((user) => {
                count ++;
                graph.addNode(count, {
                    label: user.co_author,
                    size: 10,
                    x: count + 11,
                    y: count + 10,
                    shared_papers: user.shared_paper_ids,
                    affiliation: user.affiliation,
                });
                graph.addEdge(0, count, {size : user.co_authorship_count})
            })
        
    
            loadGraph(graph);
            positions()
            assign();
            // console.log(positions());
        }, [assign, loadGraph, positions]);
    return null;
    };

    // <SigmaContainer style={{ height: "500px" , width: "500px"}}>
    //        <ForceGraph />
    // </SigmaContainer>


  return (
    <SigmaContainer
      style={{ height: "500px", width: "1500px" }}
      settings={{
        nodeProgramClasses: { image: getNodeProgramImage() },
        defaultNodeType: "image",
        defaultEdgeType: "arrow",
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
  );
   
};

export default DemoGraph;








// import React, { useEffect, useState } from "react";
// import Graph from "graphology";

// import { SigmaContainer, useSigma, useLoadGraph } from "@react-sigma/core";
// import { useLayoutCircular } from "@react-sigma/layout-circular";
// import "@react-sigma/core/lib/react-sigma.min.css";



// const ExportGraph = ({jsonData, name}) => {
//     const RandomGraph = () => {
//         const sigma = useSigma();
//         const { positions, assign } = useLayoutCircular({centre: 0.5});
//         const loadGraph = useLoadGraph();


//         useEffect(() => {
            
//             const graph = new Graph();
//             let count = 0
//             graph.addNode(0, {
//                 label: name,
//                 size: 50,
//                 x: 0,
//                 y: 0,
//             });
            
//             jsonData.map((co_author) => {
//                 count ++;
//                 graph.addNode(count, {
//                     label: co_author.author_names,
//                     size: 10,
//                     x: 0,
//                     y: 0,
//                 });
//                 graph.addEdge(0, count)
//             })
            
    
//             loadGraph(graph);
//             assign();
//             console.log(positions());
//         }, [loadGraph, assign, positions]);
//     return null;
//     };
//     return (
//         <SigmaContainer style={{ height: "500px", width: "1000px" }}>
//           <RandomGraph />
//         </SigmaContainer>
//       );

//   };

//   export default ExportGraph;




  
// import React from "react";

// import "@react-sigma/core/lib/react-sigma.min.css";
// import { MultiDirectedGraph } from "graphology";
// import { SigmaContainer } from "@react-sigma/core";


// const Graph = ({jsonData, name}) => {
//   // Create the graph
//   const graph = new MultiDirectedGraph();

//     let count = 0
//     graph.addNode(count, {
//         label: name,
//         size: 10,
//         x: 0,
//         y: 0,
//     });

//     jsonData.forEach((co_author) => {
//         count ++;
//         graph.addNode(count, {
//             label: co_author.author_names,
//             size: 10,
//             x: count + 20,
//             y: count + 1,
//         });
//         graph.addEdgeWithKey(count, 0, count)
//     })

// //   graph.addNode("A", { x: 0, y: 0, label: name, size: 10 });
// //   graph.addNode("B", { x: 1, y: 1, label: jsonData[0].author_names, size: 10 });
// //   graph.addEdgeWithKey("rel1", "A", "B", { label: "REL_1" });

//   return <SigmaContainer style={{ height: "500px" }} graph={graph}></SigmaContainer>;
// };

// export default Graph;







