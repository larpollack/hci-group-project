# Enhanced Video Conferencing Application

An interactive prototype for an enhanced version of Zoom or Teams for remote video calls, with additional features to improve meeting efficiency and participation.

## Features

### Agenda Management

- Create and manage meeting agendas with timed items
- Assign speakers to agenda items
- Track completed agenda items

### Meeting Timer

- Set timers for speakers or agenda items
- Link timers to specific agenda items
- Pause, reset, and restart timers as needed

### Speaking Queue

- Auto-generated speaking queue that rotates through participants
- Notifications for speakers when it's their turn
- Option to skip or pass your turn

### Meeting Analytics

- Real-time tracking of speaking time for all participants
- Post-meeting summary showing speaking time distribution
- Historical data comparison over the past 3 months

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/enhanced-video-conferencing.git
cd enhanced-video-conferencing
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Technology Stack

- React
- TypeScript
- Material UI
- Chart.js for data visualization
- React Beautiful DnD for drag-and-drop functionality

## Project Structure

```
/src
  /components        # UI components
  /context           # React context for state management
  /hooks             # Custom React hooks
  /types             # TypeScript type definitions
  /utils             # Utility functions
  App.tsx            # Main application component
  main.tsx           # Entry point
```

## Future Enhancements

- Integration with real video conferencing APIs
- Recording and transcription features
- AI-powered meeting insights
- Team management and user profiles
- Meeting scheduling and calendar integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
