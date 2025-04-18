import React from 'react';
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Box,
	ToggleButtonGroup,
	ToggleButton,
	Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import GridViewIcon from '@mui/icons-material/GridView';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useMeeting } from '../context/MeetingContext';
import { ViewMode, User } from '../types';

interface HeaderProps {
	toggleSidebar: () => void;
	title?: string;
	isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({
	toggleSidebar,
	title = 'Zoom Meeting-Manager',
	isSidebarOpen,
}) => {
	const { viewMode, setViewMode, users, setCurrentUser, currentUser } =
		useMeeting();

	// Store the previous non-host user to restore when leaving host view
	const [previousUser, setPreviousUser] = React.useState<User | null>(null);

	const handleViewModeChange = (
		_event: React.MouseEvent<HTMLElement>,
		newMode: ViewMode | null
	) => {
		if (newMode !== null) {
			// If we're currently in host view and switching to a different view
			if (viewMode === 'host' && newMode !== 'host' && previousUser) {
				// Restore the previous user
				setCurrentUser(previousUser);
			}

			// If switching to host view, remember current user and set to host
			if (newMode === 'host' && viewMode !== 'host') {
				// Store current user before changing to host
				setPreviousUser(currentUser);

				// Find and set host user
				const hostUser = users.find((user) => user.role === 'host');
				if (hostUser) {
					setCurrentUser(hostUser);
				}
			}

			setViewMode(newMode);
		}
	};

	return (
		<AppBar
			position='fixed'
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 1,
				backgroundColor: '#1a1a1a',
				boxShadow: 'none',
				borderBottom: '1px solid #333',
				height: '48px',
			}}
		>
			<Toolbar variant='dense' sx={{ minHeight: '48px' }}>
				<Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
					<IconButton
						color='inherit'
						aria-label={isSidebarOpen ? 'close sidebar' : 'open sidebar'}
						edge='start'
						onClick={toggleSidebar}
						sx={{ mr: 2 }}
					>
						{isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
					</IconButton>

					<Typography variant='subtitle1' noWrap component='div'>
						{title}
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					{/* View Mode Selector styled as dark buttons */}
					<Box>
						<ToggleButtonGroup
							value={viewMode}
							exclusive
							onChange={handleViewModeChange}
							aria-label='view mode'
							size='small'
							sx={{
								bgcolor: '#2d2d2d',
								border: 'none',
								'& .MuiToggleButton-root': {
									color: 'rgba(255, 255, 255, 0.7)',
									border: 'none',
									'&.Mui-selected': {
										color: '#ffffff',
										bgcolor: '#444444',
									},
									'&:hover': {
										bgcolor: '#444444',
									},
								},
							}}
						>
							<ToggleButton value='grid' aria-label='grid view'>
								<Tooltip title='Grid View'>
									<GridViewIcon fontSize='small' />
								</Tooltip>
							</ToggleButton>
							<ToggleButton value='speaker' aria-label='speaker view'>
								<Tooltip title='Speaker View'>
									<PersonIcon fontSize='small' />
								</Tooltip>
							</ToggleButton>
							<ToggleButton value='host' aria-label='host view'>
								<Tooltip title='Host View'>
									<SupervisorAccountIcon fontSize='small' />
								</Tooltip>
							</ToggleButton>
						</ToggleButtonGroup>
					</Box>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
