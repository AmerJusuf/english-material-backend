#!/bin/bash

echo "Starting English Material Generator Frontend..."
echo ""

cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Starting development server..."
echo "Frontend will be available at: http://localhost:5173"
echo ""
npm run dev

