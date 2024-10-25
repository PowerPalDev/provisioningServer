// src/theme.tsx
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#90CAF9', // Soft Blue
    },
    secondary: {
      main: '#A5D6A7', // Soft Green
    },
    error: {
      main: '#FF5722', // Coral Red
    },
    warning: {
      main: '#FFAB91', // Gentle Warm Color
    },
    info: {
      main: '#00B0FF', // Bright Cyan
    },
    success: {
      main: '#4CAF50', // Bright Green
    },
    background: {
      default: '#FAFAFA', // Off-White
      paper: '#FFFFFF', // White for cards
    },
    text: {
      primary: '#424242', // Dark Gray for primary text
      secondary: '#9E9E9E', // Warm Gray for secondary text
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90CAF9', // Soft Blue
    },
    secondary: {
      main: '#A5D6A7', // Soft Green
    },
    error: {
      main: '#FF5722', // Coral Red
    },
    warning: {
      main: '#FFAB91', // Gentle Warm Color
    },
    info: {
      main: '#00B0FF', // Bright Cyan
    },
    success: {
      main: '#4CAF50', // Bright Green
    },
    background: {
      default: '#121212', // Dark Background
      paper: '#1E1E1E', // Dark Paper for cards
    },
    text: {
      primary: '#FFFFFF', // White text
      secondary: '#B0BEC5', // Light Gray for secondary text
    },
  },
});
