import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import './index.css';

// Theme provider wrapper component
const ThemeProviderWrapper = () => {
	// Create a dark theme
	const theme = createTheme({
		palette: {
			mode: 'dark',
			primary: {
				main: '#3f51b5',
			},
			secondary: {
				main: '#f50057',
			},
			background: {
				default: '#121212',
				paper: '#1e1e1e',
			},
		},
		typography: {
			fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProviderWrapper />
	</React.StrictMode>
);
