import { useEffect, useState } from 'react';
import { Box, Container, Typography, ThemeProvider, IconButton } from '@mui/material';
import { theme } from '../theme';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import DeviceCard from '../components/DeviceCard';
import Navbar from '../components/NavBar';
import AddIcon from '@mui/icons-material/Add';
import { useDevice } from '../hooks/useDevice';
import { AddDeviceDialog } from '../components/Dialogs/AddDeviceDialog';

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
  const { devices, loading, fetchDevices, deleteDevice } = useDevice();
  const [openDeviceDialog, setOpenDeviceDialog] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    console.log("Devices updated in HomePage:", devices);
  }, [devices]);

  const onDelete = (deviceId: number) => {
    deleteDevice(deviceId);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  const handleOpenDeviceDialog = () => setOpenDeviceDialog(true);
  const handleCloseDeviceDialog = () => {
    fetchDevices();
    setOpenDeviceDialog(false)
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container maxWidth={false} sx={{ padding: 0, paddingTop: '80px' }}>
        <Card variant="outlined">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: theme.spacing(2) }}>
            <Typography variant="h6" color="text.primary">Device List</Typography>
            <IconButton color="inherit" onClick={handleOpenDeviceDialog}>
              <AddIcon />
              <Typography variant="body2" sx={{ ml: 1 }}>Add Device</Typography>
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing(2) }}>
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                ownerId={device.user_id}
                deviceId={device.id}
                handleDelete={onDelete}
              />
            ))}
          </Box>
        </Card>
      </Container>
      <AddDeviceDialog open={openDeviceDialog} handleClose={handleCloseDeviceDialog} />

    </ThemeProvider>
  );
};

export default HomePage;
