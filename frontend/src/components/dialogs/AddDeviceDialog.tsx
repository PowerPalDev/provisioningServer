import React, { useState } from 'react';
import { useDevice } from '../../hooks/useDevice';
import { DeviceClass } from '../../models/Device';
import { useUser } from '../../hooks/useUser';

interface AddDeviceDialogProps {
    open: boolean;
    handleClose: () => void;
}

export const AddDeviceDialog: React.FC<AddDeviceDialogProps> = ({ open, handleClose }) => {
    const { createDevice, fetchDevices } = useDevice();
    const { users } = useUser();

    const [deviceName, setDeviceName] = useState('');
    const [deviceMac, setDeviceMac] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [username, setUsername] = useState('');
    const [notes, setNotes] = useState('');

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newDevice = new DeviceClass(
            deviceMac,
            deviceName,
            notes,
            username
        );

        createDevice(newDevice, parseInt(ownerId, 10), () => {
            fetchDevices();
            handleClose();
        });
    };

    return (
        <div
            className={`modal fade ${open ? 'show' : ''}`}
            tabIndex={-1}
            style={{ display: open ? 'block' : 'none' }} // Ensures modal content is rendered when open
            aria-labelledby="addDeviceModal"
            aria-hidden={!open}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleFormSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="addDeviceModal">Add New Device</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleClose}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="deviceName" className="form-label">Device Name</label>
                                <input
                                    type="text"
                                    id="deviceName"
                                    name="deviceName"
                                    value={deviceName}
                                    onChange={(e) => setDeviceName(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="deviceMac" className="form-label">Device Mac Address</label>
                                <input
                                    type="text"
                                    id="deviceMac"
                                    name="deviceMac"
                                    value={deviceMac}
                                    onChange={(e) => setDeviceMac(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="deviceMac" className="form-label">Notes</label>
                                <input
                                    type="text"
                                    id="notes"
                                    name="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Owner</label>
                                <select
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => {
                                        setOwnerId(e.target.value);
                                        setUsername(e.target.value);
                                    }
                                    }
                                    className="form-select"
                                    required
                                >
                                    <option value="" disabled>
                                        Select User
                                    </option>
                                    {users.length === 0 ? (
                                        <option disabled value="">
                                            No user found
                                        </option>
                                    ) : (
                                        users.map((user) => (
                                            <option key={user.user_id} value={user.user_id}>
                                                {user.username}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">
                                Add Device
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};
