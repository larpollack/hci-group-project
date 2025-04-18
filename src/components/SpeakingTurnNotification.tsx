import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useMeeting } from '../context/MeetingContext';

interface SpeakingTurnNotificationProps {
	onDismiss: () => void;
}

const SpeakingTurnNotification: React.FC<SpeakingTurnNotificationProps> = ({
	onDismiss,
}) => {
	const { toggleMute, currentUser, skipTurn } = useMeeting();
	const [countdown, setCountdown] = useState(10);

	// Handle countdown for auto-skip
	useEffect(() => {
		if (countdown <= 0) {
			// Auto-skip if timer reaches zero
			if (currentUser) {
				skipTurn(currentUser.id);
			}
			onDismiss();
			return;
		}

		const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
		return () => clearTimeout(timer);
	}, [countdown, skipTurn, currentUser, onDismiss]);

	const handleUnmute = () => {
		if (currentUser && currentUser.isMuted) {
			toggleMute(currentUser.id);
		}
		onDismiss();
	};

	const handleSkip = () => {
		if (currentUser) {
			skipTurn(currentUser.id);
		}
		onDismiss();
	};

	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				zIndex: 2000,
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: 600,
					bgcolor: '#1a1a1a',
					borderRadius: 2,
					p: 4,
					textAlign: 'center',
					marginLeft: '320px',
				}}
			>
				<Typography variant='h4' sx={{ color: 'white', mb: 2 }}>
					It is your turn to speak.
				</Typography>
				<Typography variant='h5' sx={{ color: 'white', mb: 4 }}>
					Would you like to unmute your Mic?
				</Typography>

				<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
					<Button
						variant='contained'
						color='error'
						size='large'
						onClick={handleSkip}
						sx={{
							flex: 1,
							py: 1.5,
							fontSize: '1.2rem',
							bgcolor: '#d55',
							'&:hover': {
								bgcolor: '#c44',
							},
						}}
					>
						{countdown}s&nbsp;&nbsp;Skip Turn
					</Button>
					<Button
						variant='contained'
						color='success'
						size='large'
						onClick={handleUnmute}
						sx={{
							flex: 1,
							py: 1.5,
							fontSize: '1.2rem',
							bgcolor: '#7c7',
							color: '#000',
							'&:hover': {
								bgcolor: '#6b6',
							},
						}}
					>
						Unmute
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default SpeakingTurnNotification;
