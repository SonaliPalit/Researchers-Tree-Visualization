// NodeModal.js
import React from "react";
import Modal from "react-modal";
import Dropdown from 'react-bootstrap/Dropdown';

const NodeModal = ({ isOpen, closeModal, modalContent, selectedOption, setSelectedOption, name }) => {
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

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2>Info</h2>
      <div>
        <p> Author Name : {modalContent.label} </p>
        <p>No. of papers shared with {name} : {modalContent.count_papers}</p>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">Research Level</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedOption("PhD Student")}>PhD Student</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedOption("Associate Professor")}>Associate Professor</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedOption("Post Graduate Researcher")}>Post Graduate Researcher</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <p>{selectedOption}</p>
      </div>
      <button onClick={closeModal}>Close</button>
    </Modal>
  );
};

export default NodeModal;
