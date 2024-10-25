import React, { useState } from 'react';
import { Typography, IconButton, Box } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

interface DeviceProps {
    name: string;
    owner: string;
}

const Device: React.FC<DeviceProps> = ({ name, owner }) => {
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        setIsOn(prevState => !prevState);
    };

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
                <Typography variant="h6">{name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Owner: {owner}
                </Typography>
            </Box>
            <IconButton onClick={handleToggle} color="inherit">
                <PowerSettingsNewIcon
                    style={{
                        color: isOn ? 'blue' : 'gray',
                        fontSize: 32,
                    }}
                />
            </IconButton>
        </Box>
    );
};

export default Device;
