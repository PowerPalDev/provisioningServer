import { useState } from 'react';
import { Box, Button, Container, Typography, ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import AddIcon from '@mui/icons-material/Add';
import Device from '../components/DeviceCard';
import { AddDeviceDialog } from './AddDeviceDialog';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    width: '100%',
    borderRadius: '12px',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
}));

const HomePage = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false} sx={{ padding: 0 }}>
                <Card variant="outlined">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: theme.spacing(2) }}>
                        <Typography variant="h6" color="text.primary">Device List</Typography>
                        <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}>
                            Add New Device
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing(2) }}>
                        {Array(10).fill(0).map((_, index) => (
                            <Device key={index} name="Smart Plug" owner="John Doe" />
                        ))}
                    </Box>
                </Card>
                <AddDeviceDialog handleClose={handleClose} open={open}/>
            </Container>
        </ThemeProvider>
    );
};

export default HomePage;
