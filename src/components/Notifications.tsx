import React from 'react';
import {
	Snackbar,
	Alert,
	Stack,
	Typography,
	IconButton,
	Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMeeting } from '../context/MeetingContext';
import { Notification } from '../types';

const Notifications: React.FC = () => {
	const { notifications, dismissNotification, currentUser } = useMeeting();

	// Filter notifications for current user or general notifications
	const relevantNotifications = notifications.filter(
		(notification) =>
			!notification.userId || notification.userId === currentUser?.id
	);

	return (
		<Stack
			spacing={1}
			sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }}
		>
			{relevantNotifications.map((notification: Notification) => (
				<Snackbar
					key={notification.id}
					open={true}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					sx={{ position: 'static', mb: 1 }}
				>
					<Alert
						severity={notification.type}
						variant='filled'
						sx={{ width: '100%', minWidth: 300 }}
						action={
							<IconButton
								size='small'
								color='inherit'
								onClick={() => dismissNotification(notification.id)}
							>
								<CloseIcon fontSize='small' />
							</IconButton>
						}
					>
						<Box>
							<Typography variant='body2'>{notification.message}</Typography>
						</Box>
					</Alert>
				</Snackbar>
			))}
		</Stack>
	);
};

export default Notifications;
