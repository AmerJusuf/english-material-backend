#!/bin/bash

echo "========================================"
echo "English Material Generator Setup"
echo "========================================"
echo ""

echo "Step 1: Setting up Backend..."
echo "--------------------------------"
cd backend

if [ -d "venv" ]; then
    echo "Virtual environment already exists."
else
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo ""
    echo "Creating .env file from example..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Please edit backend/.env and add your API keys!"
    echo "- OpenAI API Key: https://platform.openai.com/api-keys"
    echo "- Anthropic API Key: https://console.anthropic.com/"
    echo ""
else
    echo ".env file already exists."
fi

cd ..

echo ""
echo "Step 2: Setting up Frontend..."
echo "--------------------------------"
cd frontend

echo "Installing Node dependencies (this may take a few minutes)..."
npm install

cd ..

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add your API keys"
echo "2. Run ./start-backend.sh in one terminal"
echo "3. Run ./start-frontend.sh in another terminal"
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "For more information, see README.md or QUICK_START.md"
echo ""

