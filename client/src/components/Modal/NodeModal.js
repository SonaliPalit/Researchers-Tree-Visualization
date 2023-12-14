import React, {useState } from "react";
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

  const [switchValues, setSwitchValues] = useState({
    'Co-Worker': modalContent.relationships ? modalContent.relationships[0].status: false,
    'Supervisor': modalContent.relationships ? modalContent.relationships[1].status: false,
    'Supervisee': modalContent.relationships ? modalContent.relationships[2].status: false,
    'External': modalContent.relationships ? modalContent.relationships[3].status: false
  });

  const handleSwitchToggle = (type) => {
    setSwitchValues((prevValues) => ({
      ...prevValues,
      [type]: !prevValues[type],
    }));
  };

  const handleRelationships = () => {
    const relationships = [];
    for (const [type, value] of Object.entries(switchValues)) {
      relationships.push({
        type,
        status: value
      });
    }
    console.log('Relationships:', relationships);
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
            <FormControlLabel
              control={<Switch checked={switchValues['Co-Worker']} onChange={() => handleSwitchToggle('Co-Worker')} />}
              label="Co-Worker"
            />
            <FormControlLabel
              control={<Switch checked={switchValues['Supervisor']} onChange={() => handleSwitchToggle('Supervisor')} />}
              label="Supervisor"
            />
            <FormControlLabel
              control={<Switch checked={switchValues['Supervisee']} onChange={() => handleSwitchToggle('Supervisee')} />}
              label="Supervisor"
            />
            <FormControlLabel
              control={<Switch checked={switchValues['External']} onChange={() => handleSwitchToggle('External')} />}
              label="External"
            />
          </FormGroup>
          <button onClick={handleRelationships}>Save Relationships</button>
        </div>
      </div>
      <button onClick={closeModal}>Close</button>
    </Modal>
  );
};

export default NodeModal;