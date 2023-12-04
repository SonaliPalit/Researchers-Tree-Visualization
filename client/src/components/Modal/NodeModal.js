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
      width: 500,
    },
    relationshipContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    relationshipText: {
      marginRight: '10px',
    },
  };

  const handleDropdownChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2>Edit Co-Author Information</h2>
      <div>
        <p> Author Name: {modalContent.label} </p>
        <p>No. of papers shared with {name}: {modalContent.count_papers}</p>
        <div style={customStyles.relationshipContainer}>
          <p style={customStyles.relationshipText}> Relationship Type:</p>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">{selectedOption || `Select Relationship to ${name}`}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleDropdownChange("Co-worker")}>Co-worker</Dropdown.Item>
              <Dropdown.Item onClick={() => handleDropdownChange("Supervisee")}>Supervisee</Dropdown.Item>
              <Dropdown.Item onClick={() => handleDropdownChange("Supervisor")}>Supervisor</Dropdown.Item>
              <Dropdown.Item onClick={() => handleDropdownChange("External")}>External</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <button onClick={closeModal}>Close</button>
    </Modal>
  );
};

export default NodeModal;