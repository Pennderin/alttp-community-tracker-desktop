#!/bin/bash

echo "================================================"
echo "  ALTTP Randomizer Community Tracker"
echo "  Desktop App Setup"
echo "================================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo ""
    echo "Install Node.js from: https://nodejs.org"
    echo "Or via your package manager:"
    echo "  macOS:  brew install node"
    echo "  Ubuntu: sudo apt install nodejs npm"
    exit 1
fi

echo "[OK] Node.js found: $(node --version)"

# Check tracker files
if [ ! -f "tracker/index.html" ]; then
    echo ""
    echo "[WARNING] Tracker files not found in tracker/ folder!"
    echo ""
    echo "Please copy your tracker files into the tracker/ subfolder."
    echo "See README.md for instructions."
    echo ""
    echo "Download from: https://github.com/KrisDavie/alttptracker"
    exit 1
fi

echo "[OK] Tracker files found."
echo ""

# Install dependencies if needed
if [ ! -d "node_modules/electron" ]; then
    echo "Installing dependencies (this may take a minute)..."
    npm install
    echo "[OK] Dependencies installed."
    echo ""
fi

echo "Starting ALTTP Randomizer Tracker..."
echo ""
npm start
