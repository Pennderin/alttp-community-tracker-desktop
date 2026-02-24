# ALTTP Community Tracker Desktop

A desktop Electron wrapper for the [ALTTP Randomizer Community Tracker](https://alttpr-tracker.filesamurai.de/) with enhanced zoom, auto-fit scaling, and window persistence.

## Features

- **Auto-fit scaling** — Content automatically scales to fit your window size
- **Zoom controls** — Ctrl+Scroll or Ctrl+/- to zoom in/out
- **Aspect ratio lock** — Window maintains correct proportions when resizing
- **Persistent window state** — Remembers your zoom level and window position between sessions
- **All tracker modes** — Supports Normal, Compact, Vertical, and No Map modes
- **Autotracking support** — Works with Lua bridge for SNES autotracking

## Based On

This project wraps the [ALTTP Randomizer Community Tracker](https://alttpr-tracker.filesamurai.de/) web application by filesamurai in an Electron desktop app. All credit for the tracker itself goes to the original author.

## Download

Download the latest release from the [Releases](https://github.com/Pennderin/alttp-community-tracker-desktop/releases) page.

## Building from Source

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)

### Install & Run
```bash
git clone https://github.com/Pennderin/alttp-community-tracker-desktop.git
cd alttp-community-tracker-desktop
npm install
npm start
```

### Build Executable
```bash
npm run build
```

The built application will be in the `dist/` folder.

## Usage

1. Launch the application
2. Configure your settings in the launcher (game type, map mode, etc.)
3. Click **Launch Tracker**
4. **Zoom**: Ctrl+Scroll wheel or Ctrl+Plus/Minus
5. **Resize**: Drag the window edges — content scales automatically
6. Your zoom and window position are saved automatically

## License

The tracker web application is by [filesamurai](https://alttpr-tracker.filesamurai.de/). The Electron wrapper code is provided as-is.
