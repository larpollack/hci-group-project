import React from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMeeting } from '../context/MeetingContext';

const TimerContainer = styled(Paper)(() => ({
	position: 'absolute',
	top: '-116px', // Position at the top of the speaker box area
	left: '50%',
	transform: 'translateX(-50%)',
	zIndex: 1200,
	padding: '3px 15px',
	backgroundColor: 'rgba(0, 0, 0, 0.75)',
	backdropFilter: 'blur(4px)',
	borderRadius: '12px',
	boxShadow: '0 4px 3px rgba(0, 255, 17, 0.3)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	border: '1px solid rgba(255, 255, 255, 0.1)',
	width: 'auto',
	margin: '0 auto',
}));

// Wrapper to position the timer relative to the video grid
const TimerWrapper = styled('div')(() => ({
	position: 'relative',
	width: '100%',
	maxWidth: '1200px',
	margin: '0 auto',
	zIndex: 1100,
}));

const FloatingTimer: React.FC = () => {
	const { timer, currentUser, activeSpeaker, viewMode } = useMeeting();

	// Format seconds to minutes and seconds
	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`;
	};

	// Only show timer in speaker view, and only for the host or active speaker
	const isHost = currentUser?.role === 'host';
	const isActiveSpeaker =
		activeSpeaker && currentUser && activeSpeaker.id === currentUser.id;
	const shouldShowTimer =
		(viewMode === 'speaker' || viewMode === 'host') &&
		(isHost || isActiveSpeaker) &&
		timer !== null;

	if (!shouldShowTimer) {
		return null;
	}

	return (
		<TimerWrapper>
			<TimerContainer elevation={3}>
				<Typography
					variant='h5'
					sx={{
						fontFamily: 'monospace',
						color: 'white',
						fontWeight: 'bold',
						letterSpacing: '0.05em',
					}}
				>
					{formatTime(timer.remaining)}
				</Typography>
			</TimerContainer>
		</TimerWrapper>
	);
};

export default FloatingTimer;
