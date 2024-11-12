import { Box, Container, Typography, ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Device from '../components/DeviceCard';
import Navbar from '../components/NavBar';

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

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false} sx={{ padding: 0 }}>
                <Navbar></Navbar>

                <Card variant="outlined">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: theme.spacing(2) }}>
                        <Typography variant="h6" color="text.primary">Device List</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing(2) }}>
                        {Array(10).fill(0).map((_, index) => (
                            <Device key={index} name="Smart Plug" owner="John Doe" />
                        ))}
                    </Box>
                </Card>
            </Container>
        </ThemeProvider>
    );
};

export default HomePage;
