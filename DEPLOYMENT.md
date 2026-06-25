# Jobsi Deployment Guide

## Prerequisites
- Node.js >= 18
- Git
- Account on a hosting platform (Railway, Render, or Heroku)

## Pre-deployment Setup

### 1. Build Frontend
```bash
cd frontend
npm run build
cd ..
```

### 2. Local Testing
```bash
npm install
npm start
```
Visit `http://localhost:4000` and verify all pages work.

---

## Deployment Options

### Option 1: Railway (Recommended - Easiest)

1. **Create Railway account**: https://railway.app
2. **Connect GitHub repository**:
   - Go to Railway Dashboard
   - Click "New Project" → "Deploy from GitHub"
   - Select `24cse109-netizen/jobsi` repository
   - Confirm deployment

3. **Railway auto-detects Node.js** and deploys automatically
4. **Your app will be live** at: `https://<your-project>.railway.app`

---

### Option 2: Render

1. **Create Render account**: https://render.com
2. **Create new Web Service**:
   - Connect GitHub repo
   - Select repository: `jobsi`
   - Runtime: Node
   - Build command: `npm install && cd frontend && npm run build && cd ..`
   - Start command: `npm start`
   - Plan: Free tier available

3. Your app will be at: `https://<your-service>.onrender.com`

---

### Option 3: Heroku (Legacy)

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create app**:
   ```bash
   heroku create jobsi-app
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

4. Your app will be at: `https://jobsi-app.herokuapp.com`

---

## Environment Variables

Create `.env` in root directory (not committed):
```
PORT=4000
NODE_ENV=production
```

---

## Post-Deployment

- ✅ Test landing page
- ✅ Test auth flow
- ✅ Test dashboard and all pages
- ✅ Verify API endpoints work
- ✅ Test notifications, chat, and filters

---

## Troubleshooting

**Frontend not loading:**
- Ensure `frontend/dist` exists (run `npm run build` in frontend)
- Check that static file serving is working

**API 404 errors:**
- Verify backend routes are properly defined
- Check CORS settings if frontend is on different domain

**Port conflicts:**
- Railway/Render assign ports automatically via `PORT` env variable

---

## Project Structure
```
jobsi/
├── server.js           # Express backend
├── data.js             # Mock data
├── package.json        # Backend dependencies
├── frontend/
│   ├── src/
│   │   └── App.jsx     # React app
│   ├── dist/           # Built production files
│   └── package.json    # Frontend dependencies
└── Procfile            # Deployment config
```

---

## Quick Deploy Button (Railway)

Add to GitHub README:

```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new?repo=https://github.com/24cse109-netizen/jobsi)
```
