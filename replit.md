# Music Shorts

## Overview

Music Shorts is a Deezer-powered short-form music player app built with React and Vite. Users can search for songs via Deezer API (no login or API key required), create 15-30 second highlight segments, add creator comments, and navigate through multiple music shorts like Instagram Stories. The app features a modern mobile-first design optimized exclusively for mobile devices.

**Live App:** https://pj-shortmusicpj.replit.app

## User Preferences

Preferred communication style: Simple, everyday language (Korean and English)

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Build Tool:** Vite 6.2.2 - Lightning-fast HMR and optimized build performance
- **UI Framework:** React 19.2.0 - Latest version with improved performance and concurrent features
- **Styling:** Vanilla CSS with mobile-first native app design

**Design System (Mobile-Exclusive):**
1. **Color Palette:**
   - Background: #000 (Pure Black)
   - Card Background: #1a1a1a, #0a0a0a
   - Primary Accent: #1DB954 (Spotify Green with gradients)
   - Text: #FFFFFF (primary), #999 (secondary)

2. **Mobile-First Layout:**
   - Full-screen immersive design (100vh, no scroll)
   - Fixed positioning to prevent overscroll
   - Large touch targets (56px+)
   - Bottom sheet modals with slide-up animation
   - No scrollbars for cleaner mobile UX
   - Tap highlight removal for native feel

3. **Interactive Elements:**
   - 3D flip animation for album covers
   - Touch feedback (scale transforms on :active)
   - Gradient buttons (#1DB954 → #1ed760)
   - Smooth cubic-bezier transitions
   - Instagram Stories-style full-screen experience

**Development Server Configuration:**
- Host: 0.0.0.0 (allows external access)
- Port: 5000 (strict port enforcement)
- All hosts allowed for Replit compatibility

### Backend Architecture

**API Integration Strategy:**

**Deezer Public API** (Complete Solution):
- 100% Deezer-powered: Search + 30-second preview playback
- No authentication required - completely free API
- 20 search results per query
- Track metadata: name, artist, album, duration, Deezer link
- Preview URL included in all responses

**Why Deezer-Only Approach:**
- No API keys or authentication needed
- Free unlimited access to search and previews
- Simplified architecture - single API source
- Better preview availability than Spotify
- Instant setup - no developer account required

**Server Stack:**
- Express.js for API endpoints
- Native Fetch API for Deezer requests
- No external API SDKs needed

## External Dependencies

### Build & Development Tools
- **Vite** (6.2.2) - Build tool and development server
- **@vitejs/plugin-react** (5.0.4) - React Fast Refresh and JSX transformation

### Frontend Libraries
- **React** (19.2.0) - Core UI library
- **React DOM** (19.2.0) - React renderer for web

### Backend Libraries
- **Express** (latest) - Web server framework
- **CORS** (latest) - Cross-origin resource sharing

### Design Resources
- **System Fonts** - -apple-system, BlinkMacSystemFont, Segoe UI, Roboto

## Project Structure

```
music-shorts/
├── src/
│   ├── api/
│   │   └── musicApi.js          # iTunes API integration
│   ├── styles/
│   │   └── style.css            # Global styles
│   ├── App.jsx                  # Main application component
│   └── main.jsx                 # React entry point
├── index.html                   # HTML entry point
├── server.js                    # Express backend server
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
└── replit.md                   # Project documentation
```

## Recent Changes

### October 24, 2025
1. ✅ **Highlight Duration Controls:**
   - Minimum highlight length: 10 seconds
   - Maximum highlight length: 20 seconds
   - Range limited to 0-30 seconds (iTunes preview duration)
   - Auto-adjustment prevents invalid ranges

2. ✅ **LocalStorage Persistence Fix:**
   - Likes now persist across page refreshes
   - Comments saved immediately to localStorage
   - New shorts saved immediately
   - Improved state management with functional updates

3. ✅ **Project Structure Cleanup:**
   - Organized files into standard React structure
   - src/api/ for API integrations
   - src/styles/ for CSS files
   - Removed temporary files and archives
   - Clean, maintainable codebase

### October 15, 2025

### Phase 1: Deezer Migration (Completed)
1. ✅ **Removed Spotify Dependencies:**
   - Deleted Spotify API client libraries
   - Removed spotify-web-api-node package
   - Removed @spotify/web-api-ts-sdk package
   - No API keys or secrets required

2. ✅ **Implemented Pure Deezer Solution:**
   - Direct Deezer API integration via Fetch
   - Search endpoint: /api/search
   - 20 results with preview URLs
   - Track data transformation to match frontend interface

### Phase 2: Mobile-Exclusive Design (Completed)
1. ✅ **Full-Screen Native App Experience:**
   - Pure black (#000) background
   - Fixed 100vh layout preventing overscroll
   - Removed desktop optimizations
   - Touch-only interactions (no hover states)
   - Instagram Stories-inspired navigation

2. ✅ **Enhanced Mobile UX:**
   - Larger touch targets (56px+)
   - Gradient buttons for visual appeal
   - Bottom sheet modals (slide-up animation)
   - No scrollbars for cleaner UI
   - Tap highlight removal (-webkit-tap-highlight-color: transparent)
   - User-select disabled for native feel

3. ✅ **Optimized Performance:**
   - Removed unnecessary fonts (Poppins)
   - System font stack for faster loading
   - Minimal dependencies
   - Lightweight CSS (under 10KB)

### Current Status
- ✅ No API keys required - instant setup
- ✅ 100% Deezer-powered search and playback
- ✅ Mobile-exclusive full-screen design
- ✅ Instagram Stories-style navigation
- ✅ Production deployment configured (autoscale)

### Known Issues & Workarounds
1. **Desktop Experience:** App is designed exclusively for mobile
   - **Workaround:** Use browser DevTools mobile emulation
   - **Future:** Add desktop detection and recommendation

2. **Preview Availability:** Deezer preview coverage varies by region
   - **Current:** Display tracks without preview with warning
   - **Future:** Add alternative preview sources

### Deployment Configuration
- **Target:** Autoscale (stateless, request-driven)
- **Build:** `npm run build` (Vite production build)
- **Run:** `node server.js` (Express server on port 5000)
- **Port:** 5000 → External port 80
- **Environment:** No secrets required - public API only

### Future Enhancements
- **Swipe Gestures:** Left/right swipe for navigation
- **Progressive Web App:** Install prompt and offline support
- **Share Functionality:** Share highlights to social media
- **Playlist Feature:** Save favorite shorts
- **Animation Polish:** More micro-interactions
- **Sound Visualizer:** Audio waveform display during playback
