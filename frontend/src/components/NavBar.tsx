import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddUserDialog } from './Dialogs/AddUserDialog';
import { handleLogout } from '../utils/authHelper';

const Navbar = () => {
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      handleLogout();
      navigate('/signin');
    } catch (e) {
      console.log(e);
    }
  };

  const handleOpenUserDialog = () => setOpenUserDialog(true);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-3">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Device Management
          </a>
          <div className="d-flex ms-auto">
            <button
              className="btn btn-light d-flex align-items-center me-2"
              onClick={handleOpenUserDialog}
            >
              <i className="bi bi-person-plus"></i>
              <span className="ms-2">Add User</span>
            </button>
            <button
              className="btn btn-danger d-flex align-items-center"
              onClick={handleSignout}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span className="ms-2">Logout</span>
            </button>
          </div>
        </div>
      </nav>
      {/* TODO add fetch devices */}
      <AddUserDialog open={openUserDialog} handleClose={() => setOpenUserDialog(false)} />
    </>
  );
};

export default Navbar;
