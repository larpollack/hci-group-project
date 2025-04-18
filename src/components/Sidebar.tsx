import React, { useState, useEffect } from 'react';
import {
	Box,
	Drawer,
	Divider,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Typography,
	IconButton,
	Tab,
	Tabs,
	TextField,
	Button,
	Checkbox,
	FormControlLabel,
	Paper,
	ListItemButton,
	Chip,
	Menu,
	MenuItem,
	Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PersonIcon from '@mui/icons-material/Person';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QueueIcon from '@mui/icons-material/Queue';
import { useMeeting } from '../context/MeetingContext';
import { AgendaItem, SpeakingQueueItem } from '../types';

interface SidebarProps {
	open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
	const {
		agenda,
		addAgendaItem,
		removeAgendaItem,
		toggleAgendaItemCompleted,
		speakingQueue,
		users,
		joinSpeakingQueue,
		skipTurn,
		currentUser,
		timer,
		startTimer,
		stopTimer,
		resetTimer,
		setAgendaSpeakingQueue,
		startAgendaItemSpeakingQueue,
	} = useMeeting();

	const [activeTab, setActiveTab] = useState(0);
	const [newAgendaItem, setNewAgendaItem] = useState({
		title: '',
		duration: 5,
		speaker: '',
	});
	const [timerDuration, setTimerDuration] = useState(300); // 5 minutes in seconds
	const [linkTimerToAgenda, setLinkTimerToAgenda] = useState(false);
	const [selectedAgendaItemId, setSelectedAgendaItemId] = useState<
		string | undefined
	>(undefined);
	const [agendaMenuAnchor, setAgendaMenuAnchor] = useState<null | HTMLElement>(
		null
	);
	const [selectedAgendaItem, setSelectedAgendaItem] =
		useState<AgendaItem | null>(null);
	const [selectedSpeakers, setSelectedSpeakers] = useState<{
		[key: string]: boolean;
	}>({});

	// Check if user has host role
	const isHostMode = currentUser?.role === 'host';

	// Reset active tab if needed when host status changes
	useEffect(() => {
		if (!isHostMode && activeTab === 1) {
			setActiveTab(0); // Switch to Agenda tab if Timer tab is selected but user is not host
		}
	}, [isHostMode, activeTab]);

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		// Handle tab changes when Timer tab (index 1) is hidden for non-hosts
		if (!isHostMode && newValue === 1) {
			// If non-host clicks what would be timer position, go to queue tab instead
			setActiveTab(2);
		} else {
			setActiveTab(newValue);
		}
	};

	// Get the actual tab index for display, considering the hidden Timer tab for non-hosts
	const getVisibleTabIndex = () => {
		if (!isHostMode && activeTab === 2) {
			return 1; // Queue tab is visually the second tab for non-hosts
		}
		return activeTab;
	};

	const handleAddAgendaItem = () => {
		if (newAgendaItem.title.trim() === '') return;

		addAgendaItem({
			title: newAgendaItem.title,
			duration: newAgendaItem.duration,
			speaker: newAgendaItem.speaker || undefined,
		});

		setNewAgendaItem({ title: '', duration: 5, speaker: '' });
	};

	const handleStartTimer = () => {
		startTimer(
			timerDuration,
			linkTimerToAgenda ? selectedAgendaItemId : undefined
		);
	};

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`;
	};

	const handleAgendaMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		item: AgendaItem
	) => {
		setAgendaMenuAnchor(event.currentTarget);
		setSelectedAgendaItem(item);

		// Reset selected speakers
		const initialSelectedSpeakers: { [key: string]: boolean } = {};
		users.forEach((user) => {
			initialSelectedSpeakers[user.id] =
				item.speakingQueue?.includes(user.id) || false;
		});
		setSelectedSpeakers(initialSelectedSpeakers);
	};

	const handleAgendaMenuClose = () => {
		setAgendaMenuAnchor(null);
		setSelectedAgendaItem(null);
	};

	const handleManageSpeakers = () => {
		if (selectedAgendaItem) {
			// Open a dialog or modal to select speakers
			// For now, we'll just toggle the speakers in the menu
			setAgendaMenuAnchor(null);
		}
	};

	const handleStartSpeakingQueue = () => {
		if (selectedAgendaItem) {
			startAgendaItemSpeakingQueue(selectedAgendaItem.id);
			handleAgendaMenuClose();
		}
	};

	const handleToggleSpeaker = (userId: string) => {
		setSelectedSpeakers((prev) => ({
			...prev,
			[userId]: !prev[userId],
		}));
	};

	const handleSaveSpeakingQueue = () => {
		if (selectedAgendaItem) {
			const selectedUserIds = Object.entries(selectedSpeakers)
				.filter(([, isSelected]) => isSelected)
				.map(([userId]) => userId);

			setAgendaSpeakingQueue(selectedAgendaItem.id, selectedUserIds);
			handleAgendaMenuClose();
		}
	};

	// Width of the drawer
	const drawerWidth = 320;

	return (
		<Drawer
			variant='persistent'
			open={open}
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: drawerWidth,
					boxSizing: 'border-box',
					top: '48px', // Updated AppBar height
					height: 'calc(100% - 48px)',
					backgroundColor: '#2d2d2d',
					color: 'white',
					borderRight: '1px solid #333',
				},
			}}
		>
			<Box sx={{ overflow: 'auto', bgcolor: '#2d2d2d' }}>
				<Tabs
					value={activeTab}
					onChange={handleTabChange}
					variant='fullWidth'
					sx={{
						bgcolor: '#1a1a1a',
						'& .MuiTab-root': {
							color: 'rgba(255, 255, 255, 0.7)',
							'&.Mui-selected': {
								color: '#ffffff',
							},
						},
						'& .MuiTabs-indicator': {
							backgroundColor: '#287ae6',
						},
					}}
				>
					<Tab label='Agenda' />
					{isHostMode && <Tab label='Timer' />}
					<Tab label='Queue' />
				</Tabs>

				<Divider sx={{ bgcolor: '#444' }} />

				{/* Agenda Tab */}
				{getVisibleTabIndex() === 0 && (
					<Box sx={{ p: 2 }}>
						<Typography variant='h6' sx={{ mb: 2, color: 'white' }}>
							Meeting Agenda
						</Typography>

						{/* Only show the add item form for hosts */}
						{isHostMode && (
							<Paper
								elevation={1}
								sx={{ p: 2, mb: 3, bgcolor: '#3d3d3d', color: 'white' }}
							>
								<Typography variant='subtitle1' gutterBottom>
									Add New Item
								</Typography>
								<TextField
									fullWidth
									label='Title'
									variant='outlined'
									size='small'
									value={newAgendaItem.title}
									onChange={(e) =>
										setNewAgendaItem({
											...newAgendaItem,
											title: e.target.value,
										})
									}
									sx={{
										mb: 2,
										'& .MuiInputBase-input': { color: 'white' },
										'& .MuiInputLabel-root': {
											color: 'rgba(255, 255, 255, 0.7)',
										},
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: 'rgba(255, 255, 255, 0.23)',
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: 'rgba(255, 255, 255, 0.5)',
										},
									}}
								/>

								<TextField
									fullWidth
									label='Duration (minutes)'
									variant='outlined'
									size='small'
									type='number'
									value={newAgendaItem.duration}
									onChange={(e) =>
										setNewAgendaItem({
											...newAgendaItem,
											duration: parseInt(e.target.value) || 5,
										})
									}
									sx={{
										mb: 2,
										'& .MuiInputBase-input': { color: 'white' },
										'& .MuiInputLabel-root': {
											color: 'rgba(255, 255, 255, 0.7)',
										},
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: 'rgba(255, 255, 255, 0.23)',
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: 'rgba(255, 255, 255, 0.5)',
										},
									}}
								/>

								<TextField
									select
									fullWidth
									label='Assigned Speaker'
									variant='outlined'
									size='small'
									value={newAgendaItem.speaker}
									onChange={(e) =>
										setNewAgendaItem({
											...newAgendaItem,
											speaker: e.target.value,
										})
									}
									sx={{
										mb: 2,
										'& .MuiInputBase-input': { color: 'white' },
										'& .MuiInputLabel-root': {
											color: 'rgba(255, 255, 255, 0.7)',
										},
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: 'rgba(255, 255, 255, 0.23)',
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: 'rgba(255, 255, 255, 0.5)',
										},
										'& .MuiSelect-select': { color: 'white' },
									}}
									SelectProps={{
										native: true,
										displayEmpty: true,
									}}
									InputLabelProps={{
										shrink: true,
									}}
								>
									<option value='' disabled>
										-- Select a speaker --
									</option>
									{users.map((user) => (
										<option key={user.id} value={user.id}>
											{user.name}
										</option>
									))}
								</TextField>

								<Button
									fullWidth
									variant='contained'
									startIcon={<AddIcon />}
									onClick={handleAddAgendaItem}
								>
									Add Item
								</Button>
							</Paper>
						)}

						<List>
							{agenda.map((item: AgendaItem) => {
								const speakerName = item.speaker
									? users.find((u) => u.id === item.speaker)?.name || 'Unknown'
									: 'Not assigned';

								// Count speakers in queue
								const queueCount = item.speakingQueue?.length || 0;

								return (
									<ListItem
										key={item.id}
										disablePadding
										secondaryAction={
											isHostMode && (
												<>
													<IconButton
														edge='end'
														onClick={(e) => handleAgendaMenuOpen(e, item)}
														sx={{ mr: 1 }}
													>
														<MoreVertIcon />
													</IconButton>
													<IconButton
														edge='end'
														onClick={() => removeAgendaItem(item.id)}
													>
														<DeleteIcon />
													</IconButton>
												</>
											)
										}
									>
										<ListItemButton
											onClick={() =>
												isHostMode && toggleAgendaItemCompleted(item.id)
											}
											disabled={!isHostMode}
											sx={{
												cursor: isHostMode ? 'pointer' : 'default',
												opacity: item.completed ? 0.5 : 1,
											}}
										>
											<ListItemIcon>
												{item.completed ? (
													<CheckCircleIcon color='success' />
												) : (
													<RadioButtonUncheckedIcon />
												)}
											</ListItemIcon>
											<ListItemText
												primary={
													<Box sx={{ display: 'flex', alignItems: 'center' }}>
														<Typography variant='body1' component='span'>
															{item.title}
														</Typography>
														{queueCount > 0 && (
															<Tooltip
																title={`${queueCount} speakers in queue`}
															>
																<Chip
																	icon={<QueueIcon />}
																	label={queueCount}
																	size='small'
																	sx={{ ml: 1 }}
																	color='primary'
																	variant='outlined'
																/>
															</Tooltip>
														)}
													</Box>
												}
												secondary={`${item.duration} min · ${speakerName}`}
											/>
										</ListItemButton>
									</ListItem>
								);
							})}
						</List>

						{/* Agenda Item Menu - only for host mode */}
						{isHostMode && (
							<Menu
								anchorEl={agendaMenuAnchor}
								open={Boolean(agendaMenuAnchor)}
								onClose={handleAgendaMenuClose}
								PaperProps={{
									sx: {
										bgcolor: '#2d2d2d',
										color: 'white',
										'& .MuiMenuItem-root:hover': {
											bgcolor: '#3d3d3d',
										},
										'& .MuiDivider-root': {
											borderColor: 'rgba(255, 255, 255, 0.12)',
										},
									},
								}}
							>
								<MenuItem onClick={handleManageSpeakers}>
									Manage Speakers
								</MenuItem>
								<Divider />
								{users.map((user) => (
									<MenuItem key={user.id} dense>
										<FormControlLabel
											control={
												<Checkbox
													checked={selectedSpeakers[user.id] || false}
													onChange={() => handleToggleSpeaker(user.id)}
													color='primary'
													size='small'
												/>
											}
											label={user.name}
											sx={{ color: 'white' }}
										/>
									</MenuItem>
								))}
								<Divider />
								<MenuItem onClick={handleSaveSpeakingQueue}>
									Save Speaking Order
								</MenuItem>
								<MenuItem onClick={handleStartSpeakingQueue}>
									Start Speaking Queue
								</MenuItem>
							</Menu>
						)}
					</Box>
				)}

				{/* Timer Tab - only visible to hosts */}
				{activeTab === 1 && isHostMode && (
					<Box sx={{ p: 2 }}>
						<Typography variant='h6' sx={{ mb: 2, color: 'white' }}>
							Meeting Timer
						</Typography>

						<Box sx={{ textAlign: 'center', mb: 3 }}>
							<Typography
								variant='h3'
								sx={{ fontFamily: 'monospace', color: 'white' }}
							>
								{timer
									? formatTime(timer.remaining)
									: formatTime(timerDuration)}
							</Typography>
						</Box>

						{!timer ? (
							<>
								<TextField
									fullWidth
									label='Duration (seconds)'
									variant='outlined'
									type='number'
									value={timerDuration}
									onChange={(e) =>
										setTimerDuration(parseInt(e.target.value) || 0)
									}
									sx={{
										mb: 2,
										'& .MuiInputBase-input': { color: 'white' },
										'& .MuiInputLabel-root': {
											color: 'rgba(255, 255, 255, 0.7)',
										},
									}}
								/>

								<FormControlLabel
									control={
										<Checkbox
											checked={linkTimerToAgenda}
											onChange={(e) => setLinkTimerToAgenda(e.target.checked)}
										/>
									}
									label='Link to agenda item'
									sx={{ mb: 2, color: 'white' }}
								/>

								{linkTimerToAgenda && (
									<TextField
										select
										fullWidth
										label='Select item'
										variant='outlined'
										size='small'
										value={selectedAgendaItemId || ''}
										onChange={(e) => setSelectedAgendaItemId(e.target.value)}
										sx={{
											mb: 2,
											'& .MuiInputLabel-root': {
												fontSize: '0.875rem',
												color: 'rgba(255, 255, 255, 0.7)',
											},
											'& .MuiSelect-select': {
												paddingTop: '8px',
												color: 'white',
											},
											'& .MuiOutlinedInput-notchedOutline': {
												borderColor: 'rgba(255, 255, 255, 0.23)',
											},
											'&:hover .MuiOutlinedInput-notchedOutline': {
												borderColor: 'rgba(255, 255, 255, 0.5)',
											},
										}}
										SelectProps={{
											native: true,
											displayEmpty: true,
										}}
										InputLabelProps={{
											shrink: true,
										}}
									>
										<option value='' disabled>
											Choose an agenda item
										</option>
										{agenda.map((item) => (
											<option key={item.id} value={item.id}>
												{item.title} ({item.duration} min)
											</option>
										))}
									</TextField>
								)}

								<Button
									fullWidth
									variant='contained'
									color='primary'
									startIcon={<PlayArrowIcon />}
									onClick={handleStartTimer}
									sx={{ mb: 1 }}
								>
									Start Timer
								</Button>
							</>
						) : (
							<Box sx={{ display: 'flex', gap: 1 }}>
								<Button
									fullWidth
									variant='contained'
									color={timer.isRunning ? 'warning' : 'success'}
									startIcon={
										timer.isRunning ? <PauseIcon /> : <PlayArrowIcon />
									}
									onClick={
										timer.isRunning
											? stopTimer
											: () => startTimer(timer.remaining)
									}
								>
									{timer.isRunning ? 'Pause' : 'Resume'}
								</Button>
								<Button
									fullWidth
									variant='outlined'
									startIcon={<RestartAltIcon />}
									onClick={resetTimer}
								>
									Reset
								</Button>
							</Box>
						)}
					</Box>
				)}

				{/* Speaking Queue Tab */}
				{activeTab === 2 && (
					<Box sx={{ p: 2 }}>
						<Typography variant='h6' sx={{ mb: 2, color: 'white' }}>
							Speaking Queue
						</Typography>

						<Button
							fullWidth
							variant='contained'
							color='primary'
							disabled={
								!currentUser ||
								speakingQueue.some((item) => item.userId === currentUser.id)
							}
							onClick={() => currentUser && joinSpeakingQueue(currentUser.id)}
							sx={{ mb: 3 }}
						>
							Join Queue
						</Button>

						{speakingQueue.length === 0 ? (
							<Typography
								variant='body2'
								color='rgba(255, 255, 255, 0.7)'
								sx={{ textAlign: 'center', mt: 2 }}
							>
								No one is in the queue
							</Typography>
						) : (
							<List>
								{speakingQueue.map(
									(queueItem: SpeakingQueueItem, index: number) => {
										const user = users.find((u) => u.id === queueItem.userId);

										// Find agenda item if this queue item is linked to one
										const linkedAgenda = queueItem.agendaItemId
											? agenda.find(
													(item) => item.id === queueItem.agendaItemId
											  )
											: null;

										const canSkip =
											isHostMode ||
											(user && currentUser && user.id === currentUser.id);

										return (
											<ListItem
												key={queueItem.id}
												disablePadding
												secondaryAction={
													canSkip && (
														<Button
															size='small'
															color='error'
															onClick={() => skipTurn(queueItem.userId)}
														>
															Skip
														</Button>
													)
												}
											>
												<ListItemButton sx={{ color: 'white' }}>
													<ListItemIcon>
														<PersonIcon
															color={index === 0 ? 'primary' : 'inherit'}
															sx={{ color: index === 0 ? undefined : 'white' }}
														/>
													</ListItemIcon>
													<ListItemText
														primary={user?.name || 'Unknown User'}
														secondary={
															<>
																{index === 0 ? (
																	<Typography
																		component='span'
																		color='primary.main'
																		variant='body2'
																	>
																		Speaking next
																	</Typography>
																) : (
																	<Typography
																		component='span'
																		color='rgba(255, 255, 255, 0.7)'
																		variant='body2'
																	>
																		Position: {index + 1}
																	</Typography>
																)}
																{linkedAgenda && (
																	<Typography
																		component='div'
																		variant='caption'
																		sx={{
																			mt: 0.5,
																			color: 'rgba(255, 255, 255, 0.7)',
																		}}
																	>
																		For: {linkedAgenda.title}
																	</Typography>
																)}
															</>
														}
													/>
												</ListItemButton>
											</ListItem>
										);
									}
								)}
							</List>
						)}
					</Box>
				)}
			</Box>
		</Drawer>
	);
};

export default Sidebar;
