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
import { GraphDefault } from "./GraphDefault";
import { useWorkerLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
Modal.setAppElement('#root')



const RED = "#b22222";
const ORANGE = "#ff7f50";
const GRAY = "#E2E2E2";

const colors =["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]


export const AuthorGraph = ({ name}) => {
  const Fa2 = () => {
    const { start, kill, isRunning } = useWorkerLayoutForceAtlas2({ settings: { slowDown: 10 } });

    useEffect(() => {
      // start FA2
      start();
      return () => {
        // Kill FA2 on unmount
        kill();
      };
    }, [start, kill]);

    return null;
  };

  return (
    <SigmaContainer style={{ height: "500px" }}>
      <GraphDefault order={100} probability={0.1} />
      <Fa2 />
    </SigmaContainer>
  );
};

export default AuthorGraph;