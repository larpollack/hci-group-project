import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { MeetingProvider, useMeeting } from './context/MeetingContext';
import Layout from './components/Layout';
import VideoGrid from './components/VideoGrid';
import MeetingSummary from './components/MeetingSummary';
import SpeakingTurnNotification from './components/SpeakingTurnNotification';
import SummarizeIcon from '@mui/icons-material/Summarize';
import VideocamIcon from '@mui/icons-material/Videocam';
import './App.css';

// Inner component to access context
const MeetingContent = () => {
	const [view, setView] = useState<'meeting' | 'summary'>('meeting');
	const { isCurrentUserTurn, dismissSpeakingTurnNotification } = useMeeting();

	const toggleView = () => {
		setView(view === 'meeting' ? 'summary' : 'meeting');
	};

	return (
		<>
			<Layout title='Enhanced Video Conferencing'>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
					<Button
						variant='contained'
						color={view === 'meeting' ? 'primary' : 'secondary'}
						startIcon={
							view === 'meeting' ? <SummarizeIcon /> : <VideocamIcon />
						}
						onClick={toggleView}
					>
						{view === 'meeting' ? 'View Summary' : 'Back to Meeting'}
					</Button>
				</Box>

				{view === 'meeting' ? (
					<Box sx={{ flexGrow: 1 }}>
						<VideoGrid />
					</Box>
				) : (
					<MeetingSummary />
				)}
			</Layout>

			{/* Speaking Turn Notification */}
			{isCurrentUserTurn && (
				<SpeakingTurnNotification onDismiss={dismissSpeakingTurnNotification} />
			)}
		</>
	);
};

function App() {
	return (
		<MeetingProvider>
			<MeetingContent />
		</MeetingProvider>
	);
}

export default App;
