# STPay Mobile

Expo mobile app for STPay. It uses the same FastAPI backend as the web frontend.

## Setup

```powershell
cd mobile
npm install
copy .env.example .env
npm run start
```

Set `EXPO_PUBLIC_API_BASE_URL` in `.env` to the backend URL reachable by your phone or emulator.

Examples:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.25:8000
```

For Android emulator:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000
```

Run the backend for mobile access with:

```powershell
cd ../backend
.\venv\Scripts\Activate.ps1
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
