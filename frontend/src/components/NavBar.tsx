import { useState } from 'react';
import { AppBar, IconButton, Toolbar, Typography, ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { AddUserDialog } from './Dialogs/AddUserDialog';
import { Logout } from '@mui/icons-material';
import { handleLogout } from '../utils/authHelper';
import { useNavigate } from 'react-router-dom';

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
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="primary" sx={{ marginBottom: '1em' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Device Management
                    </Typography>

                    <IconButton color="inherit" onClick={handleOpenUserDialog}>
                        <PersonAddIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>Add User</Typography>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleSignout}>
                        <Logout />
                        <Typography variant="body2" sx={{ ml: 1 }}>Logout</Typography>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <AddUserDialog open={openUserDialog} handleClose={() => setOpenUserDialog(false)} />
        </ThemeProvider>
    );
};

export default Navbar;
