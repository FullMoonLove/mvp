# Music Shorts 🎵

short-form music player app built with React and Vite.

## Features

- 🎶 Search for songs via iTunes API (no login or API key required)
- ✂️ Create 15-30 second highlight segments
- 💬 Add creator comments
- 🎨 Instagram Stories-style navigation
- ❤️ Like and comment on music shorts
- 💾 LocalStorage persistence

## Tech Stack

- **Frontend:** React 19, Vite 6 (frontend-only)
- **API:** iTunes Search API
- **Styling:** Vanilla CSS (mobile-first design)

## Installation

```bash
npm install
```

## Development (Frontend-only)

Start the Vite dev server:

```bash
npm run dev
```

Visit `http://localhost:5000`

## Build for Production

```bash
npm run build
```

Serve the `dist/` folder on any static host (Netlify, Vercel, GitHub Pages, S3, Nginx, etc.).

## Project Structure

```
├── src/
│   ├── api/
│   │   └── musicApi.js      # API integration
│   ├── styles/
│   │   └── style.css       # Global styles
│   ├── App.jsx             # Main component
│   └── main.jsx            # Entry point
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## License

MIT

