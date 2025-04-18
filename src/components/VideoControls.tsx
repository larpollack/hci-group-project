import React, { useState } from 'react';
import {
	Box,
	IconButton,
	Popover,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Typography,
	Tooltip,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogContent,
	FormControl,
	InputLabel,
	Select,
	SelectChangeEvent,
	Button,
	Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CelebrationIcon from '@mui/icons-material/Celebration';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GroupIcon from '@mui/icons-material/Group';
import ChatIcon from '@mui/icons-material/Chat';
import PollIcon from '@mui/icons-material/Poll';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import GridViewIcon from '@mui/icons-material/GridView';
import PanToolIcon from '@mui/icons-material/PanTool';
import PersonIcon from '@mui/icons-material/Person';
import { useMeeting } from '../context/MeetingContext';
import { Reaction } from '../types';

// The fixed container that sits at the bottom of the screen
const ControlsOuterContainer = styled(Box)(() => ({
	position: 'fixed',
	bottom: 0,
	left: 0,
	right: 0,
	display: 'flex',
	justifyContent: 'center',
	zIndex: 10,
}));

// The actual controls container centered within the outer container
const ControlsContainer = styled(Paper)(() => ({
	width: 'fit-content',
	maxWidth: '100%',
	padding: '8px 16px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: '#1a1a1a',
	borderRadius: '12px 12px 0 0',
	boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.2)',
	borderTop: '1px solid #333',
	marginLeft: '320px', // Half of the sidebar width to offset for centering
}));

const ControlButton = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	margin: '0 8px',
	color: 'white',
	textAlign: 'center',
	'&:hover': {
		color: '#2196f3', // Primary color
	},
});

const StyledIconButton = styled(IconButton)({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const LeaveButton = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	margin: '0 8px',
	color: 'white',
	backgroundColor: '#E02F2F',
	padding: '8px 16px',
	borderRadius: '4px',
	'&:hover': {
		backgroundColor: '#C42828',
	},
});

// Replace the avatar style options with different characteristics
const PERSON_TYPES = [
	{ value: 'male', label: 'Male' },
	{ value: 'female', label: 'Female' },
	{ value: 'binary', label: 'Non-Binary' },
];

const AGE_STYLES = [
	{ value: 'young', label: 'Young Adult' },
	{ value: 'middle', label: 'Middle Aged' },
	{ value: 'senior', label: 'Senior' },
];

const VideoControls: React.FC = () => {
	const {
		currentUser,
		toggleMute,
		toggleVideo,
		toggleHandRaise,
		toggleScreenSharing,
		setReaction,
		updateUserSettings,
	} = useMeeting();

	const [reactionsAnchorEl, setReactionsAnchorEl] =
		useState<HTMLButtonElement | null>(null);
	const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
	const [personType, setPersonType] = useState('male');
	const [ageRange, setAgeRange] = useState('young');

	if (!currentUser) return null;

	const handleReactionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setReactionsAnchorEl(event.currentTarget);
	};

	const handleReactionsClose = () => {
		setReactionsAnchorEl(null);
	};

	const handleReaction = (reaction: Reaction) => {
		setReaction(currentUser.id, reaction);
		handleReactionsClose();
	};

	const isReactionsOpen = Boolean(reactionsAnchorEl);

	const handleOpenAvatarDialog = () => {
		setAvatarDialogOpen(true);
	};

	const handleCloseAvatarDialog = () => {
		setAvatarDialogOpen(false);
	};

	const handleSaveAvatarSettings = () => {
		if (currentUser) {
			// Update user's face settings (we'll store them in the avatar-related fields)
			const updatedUser = {
				...currentUser,
				avatarStyle: personType, // Reuse existing field
				avatarBg: ageRange, // Reuse existing field
			};
			updateUserSettings(updatedUser);
		}
		setAvatarDialogOpen(false);
	};

	const reactions: { icon: React.ReactNode; value: Reaction; label: string }[] =
		[
			{ icon: <ThumbUpAltIcon />, value: 'thumbsUp', label: 'Thumbs Up' },
			{ icon: <CelebrationIcon />, value: 'clap', label: 'Clap' },
			{ icon: <SentimentSatisfiedAltIcon />, value: 'smile', label: 'Smile' },
			{ icon: <FavoriteIcon />, value: 'heart', label: 'Heart' },
			{ icon: <EmojiEmotionsIcon />, value: 'surprised', label: 'Surprised' },
			{ icon: <PsychologyIcon />, value: 'thinking', label: 'Thinking' },
		];

	return (
		<ControlsOuterContainer>
			<ControlsContainer elevation={3}>
				<ControlButton>
					<StyledIconButton
						color={currentUser.isMuted ? 'error' : 'inherit'}
						onClick={() => toggleMute(currentUser.id)}
					>
						{currentUser.isMuted ? <MicOffIcon /> : <MicIcon />}
					</StyledIconButton>
					<Typography variant='caption' color='inherit' align='center'>
						{currentUser.isMuted ? 'Unmute' : 'Mute'}
					</Typography>
				</ControlButton>

				<ControlButton>
					<StyledIconButton
						color={currentUser.isVideoOn ? 'inherit' : 'error'}
						onClick={() => toggleVideo(currentUser.id)}
					>
						{currentUser.isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
					</StyledIconButton>
					<Typography variant='caption' color='inherit' align='center'>
						{currentUser.isVideoOn ? 'Stop Video' : 'Start Video'}
					</Typography>
				</ControlButton>

				<ControlButton>
					<StyledIconButton color='inherit'>
						<GroupIcon />
					</StyledIconButton>
					<Typography variant='caption' color='inherit' align='center'>
						Participants
					</Typography>
				</ControlButton>

				<ControlButton>
					<StyledIconButton color='inherit'>
						<ChatIcon />
					</StyledIconButton>
					<Typography variant='caption' color='inherit' align='center'>
						Chat
					</Typography>
				</ControlButton>

				<ControlButton>
					<StyledIconButton
						color={currentUser.isScreenSharing ? 'success' : 'inherit'}
						onClick={() => toggleScreenSharing(currentUser.id)}
					>
						{currentUser.isScreenSharing ? (
							<StopScreenShareIcon />
						) : (
							<ScreenShareIcon />
						)}
					</StyledIconButton>
					<Typography variant='caption' color='inherit' align='center'>
						Share Screen
					</Typography>
				</ControlButton>

				<ControlButton>
					<StyledIconButton color='inherit'>
						<PollIcon />
					</StyledIconButton>
					<Typography variant='caption' color='inherit' align='center'>
						Polling
					</Typography>
				</ControlButton>

				<ControlButton>
					<StyledIconButton color='inherit'>
						<FiberManualRecordIcon />
					</StyledIconButton>
					<Typography variant='caption' color='inherit' align='center'>
						Record
					</Typography>
				</ControlButton>

				<ControlButton>
					<StyledIconButton color='inherit'>
						<GridViewIcon />
					</StyledIconButton>
					<Typography variant='caption' color='inherit' align='center'>
						Breakout Rooms
					</Typography>
				</ControlButton>

				<ControlButton>
					<StyledIconButton color='inherit' onClick={handleReactionsClick}>
						<EmojiEmotionsIcon />
					</StyledIconButton>
					<Typography variant='caption' color='inherit' align='center'>
						Reactions
					</Typography>
				</ControlButton>

				<ControlButton>
					<StyledIconButton
						color={currentUser.isHandRaised ? 'warning' : 'inherit'}
						onClick={() => toggleHandRaise(currentUser.id)}
					>
						<PanToolIcon />
					</StyledIconButton>
					<Typography variant='caption' color='inherit' align='center'>
						Raise Hand
					</Typography>
				</ControlButton>

				<ControlButton>
					<Tooltip title='Change Profile Photo'>
						<IconButton onClick={handleOpenAvatarDialog}>
							<PersonIcon />
						</IconButton>
					</Tooltip>
				</ControlButton>

				<LeaveButton>
					<Typography variant='body2' color='white' align='center'>
						Leave
					</Typography>
				</LeaveButton>

				<Popover
					open={isReactionsOpen}
					anchorEl={reactionsAnchorEl}
					onClose={handleReactionsClose}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
				>
					<Box sx={{ p: 1, bgcolor: '#2D2D2D' }}>
						<List
							sx={{
								display: 'flex',
								flexWrap: 'wrap',
								width: 200,
								justifyContent: 'center',
							}}
						>
							{reactions.map((reaction) => (
								<ListItem
									key={reaction.value}
									onClick={() => handleReaction(reaction.value)}
									sx={{ width: 'auto', cursor: 'pointer', color: 'white' }}
								>
									<ListItemIcon sx={{ minWidth: 36, color: 'white' }}>
										{reaction.icon}
									</ListItemIcon>
									<ListItemText primary={reaction.label} />
								</ListItem>
							))}
						</List>
					</Box>
				</Popover>

				{/* Avatar Settings Dialog */}
				<Dialog open={avatarDialogOpen} onClose={handleCloseAvatarDialog}>
					<DialogTitle>Profile Photo Settings</DialogTitle>
					<DialogContent>
						<Box sx={{ pt: 2 }}>
							<Typography variant='subtitle1' gutterBottom>
								Preview
							</Typography>
							<Box
								sx={{
									width: 180,
									height: 180,
									margin: '0 auto 20px auto',
									border: '1px solid #ddd',
									borderRadius: '8px',
									overflow: 'hidden',
								}}
							>
								<img
									src={`https://i.pravatar.cc/300?u=${
										currentUser?.id || '1'
									}-${ageRange}-${personType}`}
									alt='Profile preview'
									style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								/>
							</Box>

							<FormControl fullWidth margin='normal'>
								<InputLabel id='person-type-label'>
									Gender Presentation
								</InputLabel>
								<Select
									labelId='person-type-label'
									value={personType}
									onChange={(e: SelectChangeEvent) =>
										setPersonType(e.target.value)
									}
									label='Gender Presentation'
								>
									{PERSON_TYPES.map((type) => (
										<MenuItem key={type.value} value={type.value}>
											{type.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl fullWidth margin='normal'>
								<InputLabel id='age-range-label'>Age Style</InputLabel>
								<Select
									labelId='age-range-label'
									value={ageRange}
									onChange={(e: SelectChangeEvent) =>
										setAgeRange(e.target.value)
									}
									label='Age Style'
								>
									{AGE_STYLES.map((age) => (
										<MenuItem key={age.value} value={age.value}>
											{age.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<Stack
								direction='row'
								spacing={1}
								justifyContent='flex-end'
								sx={{ mt: 3 }}
							>
								<Button onClick={handleCloseAvatarDialog}>Cancel</Button>
								<Button variant='contained' onClick={handleSaveAvatarSettings}>
									Save
								</Button>
							</Stack>
						</Box>
					</DialogContent>
				</Dialog>
			</ControlsContainer>
		</ControlsOuterContainer>
	);
};

export default VideoControls;
