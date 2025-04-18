import React, { ReactNode } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Notifications from './Notifications';

interface LayoutProps {
	children: ReactNode;
	title?: string;
}

const Layout: React.FC<LayoutProps> = ({
	children,
	title = 'Enhanced Meeting',
}) => {
	const [sidebarOpen, setSidebarOpen] = React.useState(true);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				height: '100vh',
				overflow: 'hidden',
				bgcolor: '#121212',
			}}
		>
			<CssBaseline />

			{/* Header */}
			<Header
				toggleSidebar={toggleSidebar}
				title={title}
				isSidebarOpen={sidebarOpen}
			/>

			{/* Sidebar */}
			<Sidebar open={sidebarOpen} />

			{/* Main content */}
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					p: 0,
					width: { sm: `calc(100% - ${sidebarOpen ? 320 : 0}px)` },
					ml: { sm: 0 },
					mt: '64px', // AppBar height
					height: 'calc(100vh - 64px)',
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
					bgcolor: '#121212',
					color: 'white',
					transition: (theme) =>
						theme.transitions.create('width', {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
				}}
			>
				{children}
			</Box>

			{/* Notifications */}
			<Notifications />
		</Box>
	);
};

export default Layout;
