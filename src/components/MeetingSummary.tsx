import React, { useState } from 'react';
import {
	Box,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tabs,
	Tab,
	Button,
} from '@mui/material';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useMeeting } from '../context/MeetingContext';

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const MeetingSummary: React.FC = () => {
	const { users, speakingStats, historicalMeetings } = useMeeting();
	const [activeTab, setActiveTab] = useState(0);

	// Format seconds to minutes and seconds
	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}m ${secs}s`;
	};

	// Get user name by ID
	const getUserName = (userId: string): string => {
		const user = users.find((u) => u.id === userId);
		return user ? user.name : 'Unknown User';
	};

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	// Prepare current meeting data for chart
	const currentMeetingData = {
		labels: speakingStats.map((stat) => getUserName(stat.userId)),
		datasets: [
			{
				label: 'Speaking Time (seconds)',
				data: speakingStats.map((stat) => stat.totalTime),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
		],
	};

	// Prepare historical data for chart
	const historicalLabels = users.map((user) => user.name);

	const historicalDatasets = historicalMeetings
		.slice(0, 3)
		.map((meeting, index) => {
			const colors = [
				'rgba(255, 99, 132, 0.6)',
				'rgba(54, 162, 235, 0.6)',
				'rgba(255, 206, 86, 0.6)',
			];

			const borderColors = [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
			];

			const date = new Date(meeting.date);
			const formattedDate = `${
				date.getMonth() + 1
			}/${date.getDate()}/${date.getFullYear()}`;

			return {
				label: `Meeting on ${formattedDate}`,
				data: users.map((user) => {
					const stat = meeting.speakingStats.find((s) => s.userId === user.id);
					return stat ? stat.totalTime : 0;
				}),
				backgroundColor: colors[index],
				borderColor: borderColors[index],
				borderWidth: 1,
			};
		});

	const historicalChartData = {
		labels: historicalLabels,
		datasets: historicalDatasets,
	};

	// Chart options
	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
				labels: {
					boxWidth: 12,
					padding: 15,
					color: '#ffffff',
				},
			},
			title: {
				display: true,
				text:
					activeTab === 0
						? 'Current Meeting Speaking Time'
						: 'Speaking Time Across Recent Meetings',
				color: '#ffffff',
				font: {
					size: 16,
				},
				padding: {
					bottom: 15,
				},
			},
			tooltip: {
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				padding: 10,
				cornerRadius: 4,
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: 'rgba(255, 255, 255, 0.1)',
				},
				ticks: {
					color: '#cccccc',
					font: {
						size: 11,
					},
				},
				title: {
					display: true,
					text: 'Time (seconds)',
					color: '#ffffff',
					padding: {
						bottom: 10,
					},
				},
			},
			x: {
				grid: {
					color: 'rgba(255, 255, 255, 0.1)',
				},
				ticks: {
					color: '#cccccc',
					font: {
						size: 11,
					},
				},
			},
		},
	};

	return (
		<Box
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
		>
			<Typography variant='h4' align='center' sx={{ my: 2, color: 'white' }}>
				Meeting Summary
			</Typography>

			<Paper
				sx={{
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
					backgroundColor: '#2d2d2d',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
					borderRadius: 2,
				}}
			>
				<Tabs
					value={activeTab}
					onChange={handleTabChange}
					variant='fullWidth'
					sx={{
						borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
						'& .MuiTab-root': {
							color: 'rgba(255, 255, 255, 0.7)',
							fontWeight: 500,
							'&.Mui-selected': {
								color: '#ffffff',
							},
						},
						'& .MuiTabs-indicator': {
							backgroundColor: '#287ae6',
						},
					}}
				>
					<Tab label='CURRENT MEETING' />
					<Tab label='HISTORICAL DATA' />
				</Tabs>

				<Box
					sx={{
						p: { xs: 2, sm: 3 },
						flexGrow: 1,
						overflow: 'auto',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{activeTab === 0 ? (
						<>
							<Box
								sx={{
									height: { xs: 250, sm: 300, md: 320 },
									mb: 3,
									position: 'relative',
								}}
							>
								<Bar data={currentMeetingData} options={chartOptions} />
							</Box>

							<Typography
								variant='h6'
								gutterBottom
								sx={{
									color: 'white',
									borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
									pb: 1,
								}}
							>
								Detailed Statistics
							</Typography>

							<TableContainer
								sx={{
									flexGrow: 1,
									'& .MuiTableCell-root': {
										borderColor: 'rgba(255, 255, 255, 0.1)',
									},
									'& .MuiTableCell-head': {
										backgroundColor: 'rgba(0, 0, 0, 0.2)',
										color: 'white',
										fontWeight: 600,
									},
									'& .MuiTableCell-body': {
										color: 'rgba(255, 255, 255, 0.9)',
									},
									'& .MuiTableRow-root:hover': {
										backgroundColor: 'rgba(255, 255, 255, 0.05)',
									},
								}}
							>
								<Table size='small'>
									<TableHead>
										<TableRow>
											<TableCell>Participant</TableCell>
											<TableCell align='right'>Speaking Time</TableCell>
											<TableCell align='right'>Speaking Instances</TableCell>
											<TableCell align='right'>
												Avg. Time per Instance
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{speakingStats.map((stat) => (
											<TableRow key={stat.userId}>
												<TableCell component='th' scope='row'>
													{getUserName(stat.userId)}
												</TableCell>
												<TableCell align='right'>
													{formatTime(stat.totalTime)}
												</TableCell>
												<TableCell align='right'>
													{stat.speakingInstances}
												</TableCell>
												<TableCell align='right'>
													{stat.speakingInstances > 0
														? formatTime(
																Math.round(
																	stat.totalTime / stat.speakingInstances
																)
														  )
														: 'N/A'}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</>
					) : (
						<>
							<Box
								sx={{
									height: { xs: 250, sm: 300, md: 320 },
									mb: 3,
									position: 'relative',
								}}
							>
								<Bar data={historicalChartData} options={chartOptions} />
							</Box>

							<Typography
								variant='h6'
								gutterBottom
								sx={{
									color: 'white',
									borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
									pb: 1,
								}}
							>
								Recent Meetings
							</Typography>

							<TableContainer
								sx={{
									flexGrow: 1,
									'& .MuiTableCell-root': {
										borderColor: 'rgba(255, 255, 255, 0.1)',
									},
									'& .MuiTableCell-head': {
										backgroundColor: 'rgba(0, 0, 0, 0.2)',
										color: 'white',
										fontWeight: 600,
									},
									'& .MuiTableCell-body': {
										color: 'rgba(255, 255, 255, 0.9)',
									},
									'& .MuiTableRow-root:hover': {
										backgroundColor: 'rgba(255, 255, 255, 0.05)',
									},
								}}
							>
								<Table size='small'>
									<TableHead>
										<TableRow>
											<TableCell>Date</TableCell>
											<TableCell>Duration</TableCell>
											<TableCell>Participants</TableCell>
											<TableCell>Most Active Speaker</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{historicalMeetings.map((meeting) => {
											const date = new Date(meeting.date);
											const formattedDate = `${
												date.getMonth() + 1
											}/${date.getDate()}/${date.getFullYear()}`;

											// Find most active speaker
											const mostActiveSpeaker = meeting.speakingStats.reduce(
												(prev, current) =>
													prev.totalTime > current.totalTime ? prev : current
											);

											return (
												<TableRow key={meeting.id}>
													<TableCell>{formattedDate}</TableCell>
													<TableCell>{meeting.duration} minutes</TableCell>
													<TableCell>{meeting.participants.length}</TableCell>
													<TableCell>
														{getUserName(mostActiveSpeaker.userId)} (
														{formatTime(mostActiveSpeaker.totalTime)})
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</TableContainer>
						</>
					)}
				</Box>
			</Paper>

			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
				<Button variant='contained' color='primary'>
					Download Full Report
				</Button>
			</Box>
		</Box>
	);
};

export default MeetingSummary;
