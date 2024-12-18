import { useEffect, useState } from 'react';
import '../app_theme.scss';
import { useDevice } from '../hooks/useDevice';
import Navbar from '../components/NavBar';
import { AddDeviceDialog } from '../components/dialogs/AddDeviceDialog';
import DataTable from 'react-data-table-component';
import { Device } from '../models/Device';
import { DeleteConfirmationDialog } from '../components/dialogs/ConfirmDelete';

const HomePage = () => {
  const { devices, loading, fetchDevices, deleteDevice } = useDevice();
  const [openDeviceDialog, setOpenDeviceDialog] = useState(false);
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] = useState(false);
  const [deleteDeviceId, setDeleteDeviceId] = useState<number>(0);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>(devices);
  const [selectedUserId, setSelectedUserId] = useState<number | string>('');


  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    setFilteredDevices(devices);
  }, [devices]);

  const columns = [
    {
      name: 'Device id',
      selector: (row: Device) => row.id,
      sortable: true
    },
    {
      name: 'Name',
      selector: (row: Device) => row.name
    },
    {
      name: 'Mac address',
      selector: (row: Device) => row.mac_address
    }, {
      name: 'Notes',
      selector: (row: Device) => row.notes || "No notes available"
    },
    {
      name: 'Owner',
      selector: (row: Device) => row.user_name,
      sortable: true
    },
    {
      name: 'Azione',
      cell: (row: Device) => (
        <button
          onClick={() => onDelete(row.id)}
          className="btn btn-link text-danger"
          title="Elimina"
        >
          <i className="bi bi-trash"></i>
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  const onDelete = (deviceId: number) => {
    setDeleteDeviceId(deviceId);
    setOpenDeleteConfirmationDialog(true);
  };

  const handleOpenDeviceDialog = () => setOpenDeviceDialog(true);
  const handleCloseDeviceDialog = () => {
    fetchDevices();
    setOpenDeviceDialog(false);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    setSelectedUserId(userId);
    if (userId === '') {
      setFilteredDevices(devices);
    } else {
      const filtered = devices.filter((device) => device.user_name === userId);
      setFilteredDevices(filtered);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid mt-5 pt-5">
        <div className="card p-4 mb-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Device List</h6>
            <button className="btn btn-primary d-flex align-items-center" onClick={handleOpenDeviceDialog}>
              <i className="bi bi-plus"></i>
              <span className="ms-2">Add Device</span>
            </button>
          </div>

            <div className="mb-3">
              <label htmlFor="userFilter" className="form-label">Filter by User</label>
              <select
                id="userFilter"
                className="form-select"
                value={selectedUserId}
                onChange={handleFilterChange}
              >
                <option value="">All Users</option>
                {devices
                  .map((device) => device.user_name)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((userId) => (
                    <option key={userId} value={userId}>
                      {userId}
                    </option>
                  ))}
              </select>
            </div>

          <DataTable columns={columns} data={filteredDevices} pagination />
        </div>
      </div>
      <AddDeviceDialog open={openDeviceDialog} handleClose={handleCloseDeviceDialog} />
      <DeleteConfirmationDialog
        open={openDeleteConfirmationDialog}
        handleClose={() => setOpenDeleteConfirmationDialog(false)}
        handleDelete={() => deleteDevice(deleteDeviceId)}
      />
    </>
  );
};

export default HomePage;
