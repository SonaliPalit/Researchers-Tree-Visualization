import React from "react";
import Modal from "react-modal";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const NodeModal = ({ isOpen, closeModal, modalContent, setRelationships, name }) => {
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

  const handleRelationships = (relationships) => {
    setRelationships(relationships);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2>Edit Co-Author Information</h2>
      <div>
        <p> Author Name: {modalContent.label} </p>
        <p>No. of papers shared with {name}: {modalContent.count_papers}</p>
        <div style={customStyles.relationshipContainer}>
          <FormGroup>
            <FormControlLabel control={<Switch defaultChecked/>} label="Co-Author" />
            <FormControlLabel control={<Switch defaultChecked/>} label="Supervisor" />
            <FormControlLabel control={<Switch defaultChecked/>} label="Supervisee" />
            <FormControlLabel control={<Switch defaultChecked/>} label="External" />
          </FormGroup>
          {/* Add Toggle Buttons for each Relationship Type Based on what modalContent.relationships
          contains and for each relationship.type set the text to that*/}
          {/* Set their inital toggle state (True or False Based on 
            modalContent.relationships using each one's relationship.status t/f value*/}
          <button onClick={handleRelationships}>Save Relationships</button>
          {/* once the button is pressed the relationships state will be changed 
          and so the modal next time should reflect this as well*/}
        </div>
      </div>
      <button onClick={closeModal}>Close</button>
    </Modal>
  );
};

export default NodeModal;