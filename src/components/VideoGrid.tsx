import React from 'react';
import {
	Box,
	Grid,
	Paper,
	Typography,
	IconButton,
	Badge,
	Tooltip,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import PanToolIcon from '@mui/icons-material/PanTool';
import { styled } from '@mui/material/styles';
import { useMeeting } from '../context/MeetingContext';
import { User } from '../types';
import VideoControlsComponent from './VideoControls';
import FloatingTimer from './FloatingTimer';

// Styled components
const VideoContainer = styled(Paper)(({ theme }) => ({
	position: 'relative',
	aspectRatio: '16/9',
	overflow: 'hidden',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: '#1a1a1a',
	borderRadius: 16,
	boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
	transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
	transform: 'translateZ(0)',
	width: '100%',
	height: 'auto',
	'&.speaking': {
		border: `3px solid ${theme.palette.primary.main}`,
		boxShadow: `0 0 25px ${theme.palette.primary.main}`,
		transform: 'translateZ(0) scale(1.02)',
	},
	'&:hover': {
		boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
		transform: 'translateZ(0) translateY(-4px)',
	},
}));

const VideoControlsBar = styled(Box)(() => ({
	position: 'absolute',
	bottom: 10,
	left: 10,
	right: 10,
	padding: '8px 12px',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	backgroundColor: 'rgba(0, 0, 0, 0.7)',
	backdropFilter: 'blur(4px)',
	zIndex: 1,
	borderRadius: 8,
	transition: 'opacity 0.2s ease',
	opacity: 0.8,
	'&:hover': {
		opacity: 1,
	},
}));

const ParticipantName = styled(Typography)(() => ({
	color: 'white',
	fontWeight: 600,
	fontSize: '1.1rem',
	textShadow: '0px 0px 4px rgba(0, 0, 0, 0.9)',
	maxWidth: '80%',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
}));

const ReactionIcon = styled(Box)(() => ({
	position: 'absolute',
	top: '10%',
	right: '10%',
	fontSize: '3rem',
	animation: 'popup 0.5s ease-out forwards, float 2s ease-in-out infinite',
	zIndex: 2,
	'@keyframes popup': {
		'0%': { transform: 'scale(0)', opacity: 0 },
		'70%': { transform: 'scale(1.2)', opacity: 1 },
		'100%': { transform: 'scale(1)', opacity: 1 },
	},
	'@keyframes float': {
		'0%': { transform: 'translateY(0px)' },
		'50%': { transform: 'translateY(-10px)' },
		'100%': { transform: 'translateY(0px)' },
	},
}));

interface VideoGridProps {
	showControls?: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ showControls = true }) => {
	const {
		users,
		toggleMute,
		toggleVideo,
		currentUser,
		viewMode,
		activeSpeaker,
	} = useMeeting();

	const renderUserVideo = (user: User, isLarge = false, hideBadges = false) => {
		const isCurrentUser = currentUser?.id === user.id;
		const containerProps = isLarge
			? { className: user.isSpeaking ? 'speaking' : '' }
			: { className: user.isSpeaking ? 'speaking' : '' };

		// Get reaction emoji
		const getReactionEmoji = () => {
			switch (user.reaction) {
				case 'thumbsUp':
					return '👍';
				case 'clap':
					return '👏';
				case 'smile':
					return '😊';
				case 'heart':
					return '❤️';
				case 'surprised':
					return '😮';
				case 'thinking':
					return '🤔';
				default:
					return '';
			}
		};

		// When user is the main speaker, apply special styling
		const participantNameStyles = isLarge
			? {
					fontSize: '1.4rem',
					fontWeight: 700,
					textShadow: '0px 0px 6px rgba(0, 0, 0, 0.9)',
			  }
			: {};

		return (
			<VideoContainer {...containerProps}>
				{/* Show reaction if any */}
				{user.reaction && (
					<ReactionIcon sx={{ fontSize: isLarge ? '4rem' : '3rem' }}>
						{getReactionEmoji()}
					</ReactionIcon>
				)}

				{/* Video Feed or Placeholder */}
				{user.isScreenSharing ? (
					<Box
						sx={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: isLarge ? 'row' : 'column',
							alignItems: 'center',
							justifyContent: 'center',
							background:
								'linear-gradient(135deg, rgba(35,35,40,1) 0%, rgba(50,50,60,1) 100%)',
							color: 'white',
							padding: isLarge ? 4 : 2,
						}}
					>
						<ScreenShareIcon
							sx={{
								fontSize: isLarge ? 150 : 80,
								opacity: 0.9,
								marginBottom: !isLarge ? 2 : 0,
								mr: isLarge ? 3 : 0,
								color: 'rgba(255,255,255,0.9)',
							}}
						/>
						<Typography
							variant={isLarge ? 'h4' : 'h6'}
							sx={{
								color: 'white',
								textShadow: '0px 2px 4px rgba(0,0,0,0.4)',
								fontWeight: 500,
							}}
						>
							Sharing screen
						</Typography>
					</Box>
				) : (
					<Box
						sx={{
							position: 'relative',
							width: '100%',
							height: '100%',
							overflow: 'hidden',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Box
							component='img'
							sx={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
								objectPosition: 'center',
							}}
							alt={`${user.name}'s video`}
							src={`https://i.pravatar.cc/300?u=${user.id}-${
								user.avatarBg || ''
							}-${user.avatarStyle || ''}`}
						/>
					</Box>
				)}

				{/* Participant Info and Controls */}
				<VideoControlsBar>
					<Box display='flex' alignItems='center'>
						<Badge
							color='primary'
							variant='dot'
							invisible={!user.isSpeaking}
							sx={{ mr: 1 }}
						>
							<ParticipantName variant='subtitle1' sx={participantNameStyles}>
								{user.name} {isCurrentUser ? '(You)' : ''}
								{user.role === 'host'
									? ' (Host)'
									: user.role === 'speaker'
									? ' (Speaker)'
									: ''}
							</ParticipantName>
						</Badge>

						{/* Hand raised indicator */}
						{user.isHandRaised && !hideBadges && (
							<Tooltip title='Hand raised'>
								<PanToolIcon
									color='warning'
									sx={{
										ml: 1,
										fontSize: isLarge ? 28 : 20,
									}}
								/>
							</Tooltip>
						)}
					</Box>

					{showControls && !hideBadges && (
						<Box>
							{isCurrentUser ? (
								<>
									<Tooltip title={user.isMuted ? 'Unmute' : 'Mute'}>
										<IconButton
											size={isLarge ? 'medium' : 'small'}
											onClick={() => toggleMute(user.id)}
											sx={{ color: 'white' }}
										>
											{user.isMuted ? <MicOffIcon /> : <MicIcon />}
										</IconButton>
									</Tooltip>
									<Tooltip
										title={
											user.isVideoOn ? 'Turn off camera' : 'Turn on camera'
										}
									>
										<IconButton
											size={isLarge ? 'medium' : 'small'}
											onClick={() => toggleVideo(user.id)}
											sx={{ color: 'white' }}
										>
											{user.isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
										</IconButton>
									</Tooltip>
								</>
							) : (
								<>
									{user.isMuted && (
										<Tooltip title='Muted'>
											<MicOffIcon
												sx={{ color: 'white', opacity: 0.7, mr: 1 }}
											/>
										</Tooltip>
									)}
									{!user.isVideoOn && (
										<Tooltip title='Camera off'>
											<VideocamOffIcon sx={{ color: 'white', opacity: 0.7 }} />
										</Tooltip>
									)}
								</>
							)}
						</Box>
					)}
				</VideoControlsBar>
			</VideoContainer>
		);
	};

	return (
		<Box
			sx={{
				p: { xs: 1, sm: 2, md: 3 },
				background:
					'linear-gradient(180deg, rgba(20,20,25,1) 0%, rgba(30,30,40,1) 100%)',
				minHeight: '80vh',
				borderRadius: 2,
				boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4)',
			}}
		>
			{viewMode === 'grid' && (
				<Grid
					container
					spacing={{ xs: 2, sm: 3, md: 3 }}
					sx={{
						animation: 'fadeIn 0.5s ease-in-out',
						alignItems: 'stretch',
						'& > .MuiGrid-item': {
							display: 'flex',
						},
					}}
				>
					{users.map((user) => (
						<Grid
							key={user.id}
							sx={{
								gridColumn: {
									xs: 'span 12',
									sm:
										users.length <= 2
											? 'span 12'
											: users.length <= 4
											? 'span 6'
											: 'span 4',
									md: users.length <= 4 ? 'span 6' : 'span 4',
									lg: users.length <= 4 ? 'span 6' : 'span 4',
									xl: users.length <= 6 ? 'span 4' : 'span 3',
								},
								transition: 'all 0.3s ease',
								'@keyframes fadeIn': {
									'0%': { opacity: 0, transform: 'translateY(10px)' },
									'100%': { opacity: 1, transform: 'translateY(0)' },
								},
								padding: 1,
								height: '100%',
								display: 'flex',
							}}
						>
							<Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
								{renderUserVideo(user)}
							</Box>
						</Grid>
					))}
				</Grid>
			)}

			{(viewMode === 'speaker' || viewMode === 'host') && (
				<>
					{/* Featured speaker with timer */}
					<Box
						sx={{
							mb: 3,
							position: 'relative',
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: -16,
								left: '10%',
								width: '80%',
								height: 1,
								background:
									'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
							},
							animation: 'fadeIn 0.6s ease-out',
							'@keyframes fadeIn': {
								'0%': { opacity: 0, transform: 'scale(0.98)' },
								'100%': { opacity: 1, transform: 'scale(1)' },
							},

							mt: 5, // Add margin top so timer has room
						}}
					>
						{/* Floating Timer - will only be visible for host and active speaker */}
						<FloatingTimer />

						{renderUserVideo(activeSpeaker || users[0], true)}
					</Box>

					{/* Other participants */}
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'center',
							alignItems: 'stretch',
							animation: 'slideUp 0.5s ease-out',
							'@keyframes slideUp': {
								'0%': { opacity: 0, transform: 'translateY(20px)' },
								'100%': { opacity: 1, transform: 'translateY(0)' },
							},
							width: '100%',
							mx: 'auto',
							px: 1,
						}}
					>
						{users
							.filter((user) =>
								viewMode === 'speaker'
									? user.id !== (activeSpeaker?.id || users[0].id)
									: user.role !== 'host'
							)
							.map((user, index) => {
								// Calculate responsive grid sizing based on number of participants
								const filteredUsers = users.filter((u) =>
									viewMode === 'speaker'
										? u.id !== (activeSpeaker?.id || users[0].id)
										: u.role !== 'host'
								);
								const participantCount = filteredUsers.length;

								return (
									<Box
										key={user.id}
										sx={{
											width: {
												xs: '50%', // 2 per row on extra small screens
												sm:
													participantCount <= 3
														? '33.33%'
														: participantCount <= 6
														? '33.33%'
														: '25%',
												md:
													participantCount <= 4
														? '25%'
														: participantCount <= 8
														? '25%'
														: '16.66%',
												lg:
													participantCount <= 6
														? '16.66%'
														: participantCount <= 12
														? '16.66%'
														: '8.33%',
												xl: participantCount <= 8 ? '16.66%' : '8.33%',
											},
											animation: `fadeIn 0.3s ease-out ${index * 0.05}s`,
											height: 'auto',
											minHeight: '150px',
											display: 'flex',
											mb: 2,
											p: 1,
											boxSizing: 'border-box',
										}}
									>
										<Box
											sx={{ width: '100%', height: '100%', minHeight: '120px' }}
										>
											{renderUserVideo(user, false, true)}
										</Box>
									</Box>
								);
							})}
					</Box>
				</>
			)}

			{showControls && <VideoControlsComponent />}
		</Box>
	);
};

export default VideoGrid;
