export interface User {
	id: string;
	name: string;
	avatar?: string;
	avatarStyle?: string;
	avatarBg?: string;
	isSpeaking: boolean;
	isMuted: boolean;
	isVideoOn: boolean;
	isScreenSharing?: boolean;
	isHandRaised?: boolean;
	role: UserRole;
	reaction?: Reaction | null;
}

export type UserRole = 'host' | 'speaker' | 'participant';

export type ViewMode = 'grid' | 'speaker' | 'host';

export type Reaction =
	| 'thumbsUp'
	| 'clap'
	| 'smile'
	| 'heart'
	| 'surprised'
	| 'thinking';

export interface AgendaItem {
	id: string;
	title: string;
	duration: number; // in minutes
	speaker?: string;
	completed: boolean;
	notes?: string;
	speakingQueue?: string[]; // Array of user IDs in speaking order
}

export interface Timer {
	id: string;
	duration: number; // in seconds
	remaining: number;
	isRunning: boolean;
	linkedToAgendaItem?: string;
	linkedToSpeaker?: string;
}

export interface SpeakingQueueItem {
	id: string;
	userId: string;
	requestTime: Date;
	agendaItemId?: string;
}

export interface SpeakingStats {
	userId: string;
	totalTime: number; // in seconds
	speakingInstances: number;
}

export interface HistoricalMeeting {
	id: string;
	date: Date;
	participants: string[];
	speakingStats: SpeakingStats[];
	duration: number; // in minutes
}

export interface Notification {
	id: string;
	type: 'info' | 'warning' | 'error' | 'success';
	message: string;
	userId?: string;
	autoHide?: boolean;
	duration?: number;
}
