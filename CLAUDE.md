# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development Server
- `npm start` - Start the development server (React app runs on port 3000)
- `npm run build` - Build the app for production
- `npm test` - Run tests
- `npm run deploy` - Build and deploy to GitHub Pages

### GitHub Pages Deployment
- `npm run predeploy` - Runs build before deploy
- `npm run deploy` - Deploy to GitHub Pages using gh-pages

## Project Architecture

### Core Structure
This is a React TypeScript application built with Create React App, designed as a multi-step onboarding guide for the "Thinking Engine" analytics platform.

### Routing System
- Uses **hash-based routing** for GitHub Pages SPA compatibility
- Main routes: `/` (home), `/quickstart`, `/intro`
- Hash routing implemented in `App.tsx` with `window.location.hash`

### Key Pages
- **HomePage** (`/`): Main landing page with guide cards and navigation
- **QuickStartPage** (`/quickstart`): Step-by-step quickstart guide (4 steps)
- **IntroPage** (`/intro`): Interactive introduction with game and data collection demo

### Component Architecture

#### Layout System
- **Layout**: Main wrapper component with header and theme management
- **Header**: Navigation header with theme toggle and language switcher

#### UI Components
- **Button, Card, Badge, Input, Checkbox**: Reusable UI primitives
- **CodeBlock, CodeTabs**: Syntax-highlighted code display components
- **Tabs, InfoBox**: Content organization components
- **StepNavigation**: Multi-step flow navigation component

#### Interactive Components
- **DragonQuestGame**: Playable game component that generates analytics events
- **StepProgress**: Progress indicator for multi-step flows (currently missing)

### Context System
- **ThemeContext**: Dark/light theme management with gaming-style aesthetics
- **LanguageContext**: Internationalization support (Korean/English)

### Styling
- Uses inline styles with theme context for dynamic theming
- Gaming-inspired design with gradients, blur effects, and animations
- Responsive design with grid layouts and mobile breakpoints

### Data Flow
The IntroPage demonstrates real-time analytics data collection:
- Game interactions trigger events via `generateEvent()` function
- Events are formatted as JSON logs and displayed in real-time
- Simulates actual analytics SDK behavior

### File Organization
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Theme, Language)
├── pages/             # Main page components
│   ├── steps/         # Individual step components for guides
│   └── img/           # Page-specific images/assets
├── styles/            # CSS files
└── App.tsx            # Main app with hash routing
```

### Missing Components
- `StepProgress` component is imported in IntroPage but doesn't exist
- This causes compilation errors and prevents the intro page from working

### Development Notes
- Project uses TypeScript with strict mode enabled
- Tailwind CSS classes are used alongside inline styles
- Gaming aesthetic with purple/blue gradients and glass-morphism effects
- Real-time event simulation for demonstrating analytics capabilities