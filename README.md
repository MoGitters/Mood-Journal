# Mood Journal

A delightful mood tracking application that combines playful design with emotional insights, allowing users to capture and reflect on their daily emotional journey.

![Mood Journal Screenshot](screenshots/preview.png)

## Features

- 📝 Daily journal entries with mood tracking
- 🎵 Mood-based music playlist recommendations
- 📊 Visual analytics of your emotional patterns
- ✨ Decorative stickers to personalize your entries
- 🔔 Reminders to encourage consistent journaling
- 🎨 Customizable themes and appearance settings

## Tech Stack

- **Frontend**: React.js with TypeScript
- **UI Components**: Shadcn UI + Tailwind CSS
- **State Management**: React Query
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Express.js API
- **Storage**: In-memory database (can be connected to PostgreSQL)

## Getting Started

### Prerequisites

- Node.js (version 16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mood-journal.git
   cd mood-journal
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
/mood-journal
├── client/            # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and types
│   │   └── pages/       # Application pages
├── server/            # Express.js backend
│   ├── routes.ts      # API routes
│   └── storage.ts     # Data storage implementation
├── shared/            # Shared types and schemas
└── public/            # Static assets
```

## Key Features

### Journal Entries
Record your daily mood and thoughts with a beautiful, intuitive interface. Add playful stickers to personalize your entries and make journaling fun.

### Mood Analytics
Visualize your emotional patterns over time with beautiful charts and gain insights into your emotional well-being.

### Playlist Recommendations
Get music recommendations based on your current mood to enhance your emotional experience.

### Reminder System
Set personalized reminders to maintain a consistent journaling habit.

## Customization

The app offers several customization options:
- Light/Dark mode
- Different theme colors
- Font size adjustments
- Background gradient options

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Animated illustrations for the playful user experience
- [Shadcn UI](https://ui.shadcn.com/) for beautiful component library
- [Recharts](https://recharts.org/) for visualization components