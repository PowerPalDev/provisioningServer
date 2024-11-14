import { Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface DeviceProps {
    owner: number;
    deviceId: number,
    onDelete: (deviceId: number) => void
}

const DeviceCard: React.FC<DeviceProps> = ({ owner, deviceId}) => {

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            padding=".5em"
            border="1px solid #ccc"
            borderRadius="8px"
            sx={{
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                },
                flexWrap: 'wrap',
            }}
        >
            <Box>
                <Typography variant="h6">Device id: {deviceId}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Owner id: {owner}
                </Typography>
            </Box>
            <IconButton onClick={() => {}} color="error">
            <DeleteIcon />
            </IconButton>
        </Box>
    );
};

export default DeviceCard;
