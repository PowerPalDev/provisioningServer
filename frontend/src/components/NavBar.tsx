import { useState } from 'react';
import { AppBar, IconButton, Toolbar, Typography, ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { AddDeviceDialog } from './Dialogs/AddDeviceDialog';
import { AddUserDialog } from './Dialogs/AddUserDialog';

const Navbar = () => {
    const [openDeviceDialog, setOpenDeviceDialog] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);

    const handleOpenDeviceDialog = () => setOpenDeviceDialog(true);
    const handleCloseDeviceDialog = () => setOpenDeviceDialog(false);
    const handleOpenUserDialog = () => setOpenUserDialog(true);
    const handleCloseUserDialog = () => setOpenUserDialog(false);

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Device Management
                    </Typography>
                    <IconButton color="inherit" onClick={handleOpenDeviceDialog}>
                        <AddIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>Add Device</Typography>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleOpenUserDialog}>
                        <PersonAddIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>Add User</Typography>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <AddDeviceDialog open={openDeviceDialog} handleClose={handleCloseDeviceDialog} />
            <AddUserDialog open={openUserDialog} handleClose={handleCloseUserDialog} />
        </ThemeProvider>
    );
};

export default Navbar;
