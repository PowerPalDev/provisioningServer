import React, { useState } from 'react';
import { DeleteConfirmationDialog } from './Dialogs/ConfirmDelete';

interface DeviceProps {
  ownerId: number;
  deviceId: number;
  handleDelete: (deviceId: number) => void;
}

const DeviceCard: React.FC<DeviceProps> = ({ ownerId, deviceId, handleDelete }) => {
  const [openDeviceDialog, setOpenDeviceDialog] = useState(false);

  return (
    <div
      className="d-flex align-items-center justify-content-between p-3 border rounded shadow-sm"
      style={{
        transition: 'box-shadow 0.3s ease-in-out',
      }}
      onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.2)')}
      onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.1)')}
    >
      <div>
        <h6 className="mb-1">Device ID: {deviceId}</h6>
        <p className="text-muted mb-0">Owner ID: {ownerId}</p>
      </div>
      <button
        className="btn btn-danger btn-sm"
        onClick={() => setOpenDeviceDialog(true)}
      >
        <i className="bi bi-trash"></i>
      </button>
      <DeleteConfirmationDialog
        open={openDeviceDialog}
        handleClose={() => setOpenDeviceDialog(false)}
        handleDelete={() => handleDelete(deviceId)}
      />
    </div>
  );
};

export default DeviceCard;
