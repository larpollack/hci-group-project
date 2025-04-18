import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
	User,
	AgendaItem,
	Timer,
	SpeakingQueueItem,
	SpeakingStats,
	HistoricalMeeting,
	Notification,
	ViewMode,
	Reaction,
} from '../types';

// Sample data for demonstration
const SAMPLE_USERS: User[] = [
	{
		id: '1',
		name: 'Alex Johnson',
		isSpeaking: false,
		isMuted: false,
		isVideoOn: true,
		isScreenSharing: false,
		isHandRaised: false,
		role: 'host',
		reaction: null,
	},
	{
		id: '2',
		name: 'Jamie Smith',
		isSpeaking: false,
		isMuted: true,
		isVideoOn: true,
		isScreenSharing: false,
		isHandRaised: false,
		role: 'speaker',
		reaction: null,
	},
	{
		id: '3',
		name: 'Taylor Wilson',
		isSpeaking: false,
		isMuted: false,
		isVideoOn: true,
		isScreenSharing: false,
		isHandRaised: false,
		role: 'speaker',
		reaction: null,
	},
	{
		id: '4',
		name: 'Morgan Lee',
		isSpeaking: false,
		isMuted: false,
		isVideoOn: false,
		isScreenSharing: false,
		isHandRaised: true,
		role: 'participant',
		reaction: null,
	},
	{
		id: '5',
		name: 'Casey Brown',
		isSpeaking: false,
		isMuted: false,
		isVideoOn: true,
		isScreenSharing: false,
		isHandRaised: false,
		role: 'participant',
		reaction: null,
	},
];

const SAMPLE_AGENDA: AgendaItem[] = [
	{
		id: '1',
		title: 'Project Updates',
		duration: 10,
		speaker: '1',
		completed: false,
		speakingQueue: ['1', '2', '3'],
	},
	{
		id: '2',
		title: 'Budget Review',
		duration: 15,
		speaker: '2',
		completed: false,
		speakingQueue: ['2', '3', '5'],
	},
	{
		id: '3',
		title: 'Team Feedback',
		duration: 20,
		speaker: '3',
		completed: false,
		speakingQueue: ['3', '4', '1', '5'],
	},
	{
		id: '4',
		title: 'Next Steps',
		duration: 10,
		speaker: '4',
		completed: false,
		speakingQueue: ['4', '1', '2'],
	},
];

const SAMPLE_HISTORICAL_DATA: HistoricalMeeting[] = [
	{
		id: '1',
		date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
		participants: ['1', '2', '3', '4'],
		speakingStats: [
			{ userId: '1', totalTime: 520, speakingInstances: 12 },
			{ userId: '2', totalTime: 310, speakingInstances: 8 },
			{ userId: '3', totalTime: 680, speakingInstances: 15 },
			{ userId: '4', totalTime: 240, speakingInstances: 5 },
		],
		duration: 45,
	},
	{
		id: '2',
		date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
		participants: ['1', '2', '3', '5'],
		speakingStats: [
			{ userId: '1', totalTime: 450, speakingInstances: 10 },
			{ userId: '2', totalTime: 380, speakingInstances: 9 },
			{ userId: '3', totalTime: 720, speakingInstances: 14 },
			{ userId: '5', totalTime: 290, speakingInstances: 7 },
		],
		duration: 50,
	},
	{
		id: '3',
		date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
		participants: ['1', '3', '4', '5'],
		speakingStats: [
			{ userId: '1', totalTime: 480, speakingInstances: 11 },
			{ userId: '3', totalTime: 650, speakingInstances: 13 },
			{ userId: '4', totalTime: 270, speakingInstances: 6 },
			{ userId: '5', totalTime: 320, speakingInstances: 8 },
		],
		duration: 40,
	},
];

interface MeetingContextProps {
	users: User[];
	currentUser: User | null;
	agenda: AgendaItem[];
	speakingQueue: SpeakingQueueItem[];
	timer: Timer | null;
	speakingStats: SpeakingStats[];
	notifications: Notification[];
	historicalMeetings: HistoricalMeeting[];
	viewMode: ViewMode;
	activeSpeaker: User | null;
	isCurrentUserTurn: boolean;
	dismissSpeakingTurnNotification: () => void;

	// User actions
	updateUserSettings: (updatedUser: User) => void;
	toggleMute: (userId: string) => void;
	toggleVideo: (userId: string) => void;
	toggleHandRaise: (userId: string) => void;
	toggleScreenSharing: (userId: string) => void;
	setReaction: (userId: string, reaction: Reaction | null) => void;
	joinSpeakingQueue: (userId: string, agendaItemId?: string) => void;
	skipTurn: (userId: string) => void;
	setCurrentUser: (user: User) => void;

	// Agenda actions
	addAgendaItem: (item: Omit<AgendaItem, 'id' | 'completed'>) => void;
	removeAgendaItem: (itemId: string) => void;
	toggleAgendaItemCompleted: (itemId: string) => void;
	setAgendaSpeakingQueue: (agendaItemId: string, userIds: string[]) => void;
	startAgendaItemSpeakingQueue: (agendaItemId: string) => void;

	// View actions
	setViewMode: (mode: ViewMode) => void;

	// Timer actions
	startTimer: (
		duration: number,
		linkedToAgendaItem?: string,
		linkedToSpeaker?: string
	) => void;
	stopTimer: () => void;
	resetTimer: () => void;

	// Notification actions
	addNotification: (notification: Omit<Notification, 'id'>) => void;
	dismissNotification: (notificationId: string) => void;
}

const MeetingContext = createContext<MeetingContextProps | undefined>(
	undefined
);

interface MeetingProviderProps {
	children: ReactNode;
}

export const MeetingProvider: React.FC<MeetingProviderProps> = ({
	children,
}) => {
	const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
	const [currentUser, setCurrentUser] = useState<User>(SAMPLE_USERS[2]); // Taylor Wilson (speaker, not host)
	const [agenda, setAgenda] = useState<AgendaItem[]>(SAMPLE_AGENDA);
	const [speakingQueue, setSpeakingQueue] = useState<SpeakingQueueItem[]>([]);
	const [timer, setTimer] = useState<Timer | null>(null);
	const [speakingStats, setSpeakingStats] = useState<SpeakingStats[]>([]);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [historicalMeetings] = useState<HistoricalMeeting[]>(
		SAMPLE_HISTORICAL_DATA
	);
	const [viewMode, setViewMode] = useState<ViewMode>('speaker'); // Default to speaker view
	const [activeSpeaker, setActiveSpeaker] = useState<User | null>(null);
	const [isCurrentUserTurn, setIsCurrentUserTurn] = useState<boolean>(false);

	// Find the currently speaking user to set as active speaker
	useEffect(() => {
		const speakingUser = users.find((user) => user.isSpeaking);
		setActiveSpeaker(speakingUser || null);
	}, [users]);

	// Initialize speaking stats for current users
	useEffect(() => {
		const initialStats = users.map((user) => ({
			userId: user.id,
			totalTime: 0,
			speakingInstances: 0,
		}));
		setSpeakingStats(initialStats);
	}, [users]);

	// Timer countdown effect
	useEffect(() => {
		let interval: number | undefined;

		if (timer && timer.isRunning && timer.remaining > 0) {
			interval = window.setInterval(() => {
				setTimer((prevTimer) => {
					if (prevTimer && prevTimer.remaining > 0) {
						return { ...prevTimer, remaining: prevTimer.remaining - 1 };
					} else if (prevTimer) {
						// Time's up
						addNotification({
							type: 'info',
							message: 'Timer has ended',
							autoHide: true,
							duration: 5000,
						});
						return { ...prevTimer, isRunning: false };
					}
					return prevTimer;
				});
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [timer]);

	// Speaking queue management
	useEffect(() => {
		if (speakingQueue.length > 0) {
			// Get next speaker in queue
			const nextInQueue = speakingQueue[0];
			const nextSpeaker = users.find((u) => u.id === nextInQueue.userId);

			// If no one is currently speaking, promote the next person in queue
			if (!users.some((u) => u.isSpeaking) && nextSpeaker) {
				// Check if next speaker is the current user
				if (nextSpeaker.id === currentUser?.id) {
					// Set flag to show speaking turn notification
					setIsCurrentUserTurn(true);
				} else {
					// For other users, send regular notification
					addNotification({
						type: 'success',
						message: `It's ${nextSpeaker.name}'s turn to speak`,
						userId: nextSpeaker.id,
						autoHide: true,
						duration: 10000,
					});
				}

				// Auto-update speaking status
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === nextSpeaker.id
							? { ...user, isSpeaking: true }
							: { ...user, isSpeaking: false }
					)
				);

				// Remove from queue
				setSpeakingQueue((prevQueue) => prevQueue.slice(1));

				// Update speaking stats
				setSpeakingStats((prevStats) =>
					prevStats.map((stat) =>
						stat.userId === nextSpeaker.id
							? { ...stat, speakingInstances: stat.speakingInstances + 1 }
							: stat
					)
				);
			}
		}
	}, [speakingQueue, users, currentUser]);

	// Track speaking time for statistics
	useEffect(() => {
		const interval = window.setInterval(() => {
			const speakingUsers = users.filter(
				(user) => user.isSpeaking && !user.isMuted
			);

			if (speakingUsers.length > 0) {
				setSpeakingStats((prevStats) =>
					prevStats.map((stat) => {
						const isSpeaking = speakingUsers.some(
							(user) => user.id === stat.userId
						);
						return isSpeaking
							? { ...stat, totalTime: stat.totalTime + 1 }
							: stat;
					})
				);
			}
		}, 1000);

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [users]);

	// Auto-clear reactions after 5 seconds
	useEffect(() => {
		const reactingUsers = users.filter((user) => user.reaction !== null);

		if (reactingUsers.length > 0) {
			const timeouts = reactingUsers.map((user) => {
				return setTimeout(() => {
					setReaction(user.id, null);
				}, 5000);
			});

			return () => {
				timeouts.forEach((timeout) => clearTimeout(timeout));
			};
		}
	}, [users]);

	// User actions
	const updateUserSettings = (updatedUser: User) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
		);

		// Also update currentUser if needed
		if (currentUser && currentUser.id === updatedUser.id) {
			setCurrentUser(updatedUser);
		}
	};

	const toggleMute = (userId: string) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user.id === userId ? { ...user, isMuted: !user.isMuted } : user
			)
		);
	};

	const toggleVideo = (userId: string) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user.id === userId ? { ...user, isVideoOn: !user.isVideoOn } : user
			)
		);
	};

	const toggleHandRaise = (userId: string) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) => {
				if (user.id === userId) {
					const newState = !user.isHandRaised;
					// Notify when someone raises hand, but only if:
					// 1. The hand is being raised (not lowered)
					// 2. The current user is a host
					// 3. The current user is not the one raising their hand (to prevent duplicate notifications)
					if (
						newState &&
						currentUser?.role === 'host' &&
						currentUser.id !== userId
					) {
						addNotification({
							type: 'info',
							message: `${user.name} raised their hand`,
							autoHide: true,
							duration: 5000,
						});
					}
					return { ...user, isHandRaised: newState };
				}
				return user;
			})
		);
	};

	const toggleScreenSharing = (userId: string) => {
		setUsers((prevUsers) => {
			const isUserSharing = prevUsers.find(
				(u) => u.id === userId
			)?.isScreenSharing;

			return prevUsers.map((user) => {
				// If enabling for this user, disable for all others
				if (user.id === userId) {
					return { ...user, isScreenSharing: !user.isScreenSharing };
				} else if (!isUserSharing) {
					// Only turn off others if this user is starting to share
					return { ...user, isScreenSharing: false };
				}
				return user;
			});
		});
	};

	const setReaction = (userId: string, reaction: Reaction | null) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user.id === userId ? { ...user, reaction } : user
			)
		);
	};

	const joinSpeakingQueue = (userId: string, agendaItemId?: string) => {
		// Don't add if already in queue
		if (speakingQueue.some((item) => item.userId === userId)) {
			console.log('User already in queue - not adding again');
			return;
		}

		const queueItem: SpeakingQueueItem = {
			id: uuidv4(),
			userId,
			requestTime: new Date(),
			agendaItemId,
		};

		// Check if this is the first person joining an empty queue
		const isFirstInEmptyQueue = speakingQueue.length === 0;

		// Check if the user who wants to join is already speaking
		const isUserAlreadySpeaking = users.some(
			(u) => u.id === userId && u.isSpeaking
		);

		console.log('Join Queue - Debug Info:', {
			userId,
			isCurrentUser: userId === currentUser?.id,
			isFirstInEmptyQueue,
			isUserAlreadySpeaking,
			currentUserIsSpeaking: currentUser?.isSpeaking,
			shouldShowNotification:
				isFirstInEmptyQueue ||
				(userId === currentUser?.id && isUserAlreadySpeaking),
		});

		setSpeakingQueue((prevQueue) => [...prevQueue, queueItem]);

		// Notify user they've been added to queue
		addNotification({
			type: 'info',
			message: `You've been added to the speaking queue`,
			userId,
			autoHide: true,
			duration: 3000,
		});

		// If they're the only one in the queue OR they're already speaking,
		// immediately process their turn
		if (
			isFirstInEmptyQueue ||
			(userId === currentUser?.id && isUserAlreadySpeaking)
		) {
			const user = users.find((u) => u.id === userId);
			console.log('Processing immediate turn for user:', user?.name);

			// If this is the current user, show the speaking turn notification
			if (userId === currentUser?.id) {
				console.log('Setting isCurrentUserTurn to true');
				// Force display of speaking turn notification, even if already speaking
				setIsCurrentUserTurn(true);

				// Only update speaking status if they aren't already speaking
				if (!isUserAlreadySpeaking) {
					setUsers((prevUsers) =>
						prevUsers.map((u) =>
							u.id === userId
								? { ...u, isSpeaking: true }
								: { ...u, isSpeaking: false }
						)
					);
				}

				// Remove from queue immediately
				setSpeakingQueue([]);

				// Update speaking stats
				setSpeakingStats((prevStats) =>
					prevStats.map((stat) =>
						stat.userId === userId
							? { ...stat, speakingInstances: stat.speakingInstances + 1 }
							: stat
					)
				);
			} else {
				addNotification({
					type: 'warning',
					message: `${user?.name} is next to speak`,
					userId,
					autoHide: true,
					duration: 7000,
				});
			}
		}
	};

	const skipTurn = (userId: string) => {
		setSpeakingQueue((prevQueue) =>
			prevQueue.filter((item) => item.userId !== userId)
		);
	};

	// Agenda actions
	const addAgendaItem = (item: Omit<AgendaItem, 'id' | 'completed'>) => {
		const newItem: AgendaItem = {
			...item,
			id: uuidv4(),
			completed: false,
		};

		setAgenda((prevAgenda) => [...prevAgenda, newItem]);
	};

	const removeAgendaItem = (itemId: string) => {
		setAgenda((prevAgenda) => prevAgenda.filter((item) => item.id !== itemId));
	};

	const toggleAgendaItemCompleted = (itemId: string) => {
		setAgenda((prevAgenda) =>
			prevAgenda.map((item) =>
				item.id === itemId ? { ...item, completed: !item.completed } : item
			)
		);
	};

	const setAgendaSpeakingQueue = (agendaItemId: string, userIds: string[]) => {
		setAgenda((prevAgenda) =>
			prevAgenda.map((item) =>
				item.id === agendaItemId ? { ...item, speakingQueue: userIds } : item
			)
		);
	};

	const startAgendaItemSpeakingQueue = (agendaItemId: string) => {
		const agendaItem = agenda.find((item) => item.id === agendaItemId);

		if (
			agendaItem &&
			agendaItem.speakingQueue &&
			agendaItem.speakingQueue.length > 0
		) {
			// Clear current queue and add all speakers from the agenda item
			setSpeakingQueue([]);

			const newQueue = agendaItem.speakingQueue.map((userId, index) => ({
				id: uuidv4(),
				userId,
				requestTime: new Date(Date.now() + index * 1000), // Stagger times slightly
				agendaItemId,
			}));

			setSpeakingQueue(newQueue);

			// Notify the first speaker
			const firstSpeaker = users.find(
				(user) => user.id === agendaItem.speakingQueue?.[0]
			);
			if (firstSpeaker) {
				addNotification({
					type: 'warning',
					message: `${firstSpeaker.name} is next to speak for "${agendaItem.title}"`,
					userId: firstSpeaker.id,
					autoHide: true,
					duration: 7000,
				});
			}
		}
	};

	// Timer actions
	const startTimer = (
		duration: number,
		linkedToAgendaItem?: string,
		linkedToSpeaker?: string
	) => {
		setTimer({
			id: uuidv4(),
			duration,
			remaining: duration,
			isRunning: true,
			linkedToAgendaItem,
			linkedToSpeaker,
		});
	};

	const stopTimer = () => {
		setTimer((prevTimer) =>
			prevTimer ? { ...prevTimer, isRunning: false } : null
		);
	};

	const resetTimer = () => {
		setTimer((prevTimer) =>
			prevTimer
				? { ...prevTimer, remaining: prevTimer.duration, isRunning: false }
				: null
		);
	};

	// Notification actions
	const addNotification = (notification: Omit<Notification, 'id'>) => {
		const newNotification: Notification = {
			...notification,
			id: uuidv4(),
		};

		setNotifications((prevNotifications) => [
			...prevNotifications,
			newNotification,
		]);

		// Auto dismiss notification if configured
		if (notification.autoHide && notification.duration) {
			setTimeout(() => {
				dismissNotification(newNotification.id);
			}, notification.duration);
		}
	};

	const dismissNotification = (notificationId: string) => {
		setNotifications((prevNotifications) =>
			prevNotifications.filter(
				(notification) => notification.id !== notificationId
			)
		);
	};

	// For dismissing the speaking turn notification
	const dismissSpeakingTurnNotification = () => {
		console.log('Dismissing speaking turn notification');
		setIsCurrentUserTurn(false);
	};

	// Add an effect to monitor isCurrentUserTurn changes
	useEffect(() => {
		console.log('isCurrentUserTurn changed:', isCurrentUserTurn);
	}, [isCurrentUserTurn]);

	const contextValue: MeetingContextProps = {
		users,
		currentUser,
		agenda,
		speakingQueue,
		timer,
		speakingStats,
		notifications,
		historicalMeetings,
		viewMode,
		activeSpeaker,
		isCurrentUserTurn,
		dismissSpeakingTurnNotification,

		// User actions
		updateUserSettings,
		toggleMute,
		toggleVideo,
		toggleHandRaise,
		toggleScreenSharing,
		setReaction,
		joinSpeakingQueue,
		skipTurn,
		setCurrentUser,

		// Agenda actions
		addAgendaItem,
		removeAgendaItem,
		toggleAgendaItemCompleted,
		setAgendaSpeakingQueue,
		startAgendaItemSpeakingQueue,

		// View actions
		setViewMode,

		// Timer actions
		startTimer,
		stopTimer,
		resetTimer,

		// Notification actions
		addNotification,
		dismissNotification,
	};

	return (
		<MeetingContext.Provider value={contextValue}>
			{children}
		</MeetingContext.Provider>
	);
};

export const useMeeting = () => {
	const context = useContext(MeetingContext);
	if (context === undefined) {
		throw new Error('useMeeting must be used within a MeetingProvider');
	}
	return context;
};
