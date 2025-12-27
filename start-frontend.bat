@echo off
echo Starting English Material Generator Frontend...
echo.

cd frontend

if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting development server...
echo Frontend will be available at: http://localhost:5173
echo.
call npm run dev

