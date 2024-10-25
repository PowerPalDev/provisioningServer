import { Box, Button, Container, Typography, ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import AddIcon from '@mui/icons-material/Add';
import Device from '../components/DeviceCard';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    width: '100%',
    borderRadius: '8px',
    gap: theme.spacing(2),
    padding: '1em',
    boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const HomePage = () => {
    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false} sx={{ padding: 0 }}>
                <Card variant="outlined">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1em', bgcolor: 'blue', padding: '1em'
                     }}>
                        <Typography>Device list</Typography>
                        <Button variant="contained" endIcon={<AddIcon />}>
                            <Typography>Add new device</Typography>
                        </Button>
                    </Box>
                    <Device name="Smart Plug" owner="John Doe" />
                    <Device name="Smart Plug" owner="John Doe" />
                    <Device name="Smart Plug" owner="John Doe" />
                    <Device name="Smart Plug" owner="John Doe" />
                    <Device name="Smart Plug" owner="John Doe" />
                    <Device name="Smart Plug" owner="John Doe" />
                    <Device name="Smart Plug" owner="John Doe" />
                    <Device name="Smart Plug" owner="John Doe" />
                    <Device name="Smart Plug" owner="John Doe" />
                    <Device name="Smart Plug" owner="John Doe" />
                </Card>
            </Container>
        </ThemeProvider>
    );
};

export default HomePage;
