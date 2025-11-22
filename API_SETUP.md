# API Setup Guide

## Configuration

The API is configured to use `http://localhost:8000` for development. Update `src/config/api.js` to change the base URL.

## CORS Configuration (Required)

Since you're running on web, you need to configure CORS on your backend to allow requests from the Expo web development server.

**Your backend must allow CORS from the frontend origin to avoid CORS errors.**

### For Express.js:
```javascript
const cors = require('cors');

// Install cors if not already: npm install cors

app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006'], // Expo web dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Make sure this is BEFORE your routes
app.use('/api/v1', yourRouter);
```

### For Django (Python):
```python
# Install: pip install django-cors-headers

# settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the top
    'django.middleware.common.CommonMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "http://localhost:19006",
]

CORS_ALLOW_CREDENTIALS = True
```

### For Flask (Python):
```python
# Install: pip install flask-cors

from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:8081", "http://localhost:19006"], 
     supports_credentials=True)
```

### For FastAPI (Python):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "http://localhost:19006"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods including OPTIONS
    allow_headers=["*"],  # Allows all headers
)

# Make sure this is added BEFORE your route definitions
```

### Important Notes:
- CORS middleware must be added **BEFORE** your route handlers
- The backend must handle **OPTIONS** requests (preflight) - most CORS libraries do this automatically
- If you're getting 404, verify your route is registered at `/api/v1/auth/register`

## Troubleshooting

### Request Timeout Error
1. Verify backend is running at `http://localhost:8000`
2. Test the endpoint directly in browser: `http://localhost:8000/api/v1/auth/register`
3. Check if firewall is blocking port 8000

### CORS Errors
- **Error: "No 'Access-Control-Allow-Origin' header"**
  - Ensure CORS is configured on your backend (see above)
  - Verify the backend allows requests from `http://localhost:8081` or `http://localhost:19006`
  - Make sure CORS middleware is added **BEFORE** your routes
  - Restart your backend server after adding CORS configuration

- **Error: "Response to preflight request doesn't pass access control check"**
  - The backend must handle OPTIONS requests (preflight)
  - Most CORS libraries handle this automatically, but verify your backend responds to OPTIONS requests
  - Check that `allow_methods` includes 'OPTIONS' or is set to `["*"]`

- **404 Error on OPTIONS request**
  - This means your backend isn't handling the preflight request
  - Ensure CORS middleware is properly configured and placed before routes
  - Verify your route exists at `/api/v1/auth/register`

### Production
Update the `API_BASE_URL` in `src/config/api.js` to your production API URL.

