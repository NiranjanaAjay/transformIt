#!/bin/bash
# Quick Start Guide - Autonomous Content Factory (TransformIt)

## 🚀 QUICK START (Choose one method)

### METHOD 1: Using Command Prompt (Recommended for Windows)
1. Open Command Prompt (cmd.exe)
2. Navigate to project:
   ```
   cd c:\Users\NIRANJANA\Desktop\Transform
   ```
3. Install dependencies:
   ```
   npm install react-router-dom axios
   ```
4. Start dev server:
   ```
   npm run dev
   ```
5. Open browser to: http://localhost:5173

### METHOD 2: Using Git Bash or WSL
1. Open Git Bash
2. Navigate to project:
   ```
   cd /c/Users/NIRANJANA/Desktop/Transform
   ```
3. Follow same npm commands as Method 1

### METHOD 3: Using VS Code Terminal
1. Open VS Code
2. File > Open Folder > Select "c:\Users\NIRANJANA\Desktop\Transform"
3. Terminal > New Terminal (PowerShell / Command Prompt option)
4. Run: npm install react-router-dom axios
5. Run: npm run dev

---

## 📋 PROJECT FEATURES

### ✨ Three Sections:

**Landing Page**
- Hero with animated title
- "How It Works" explanation
- Sign up / Sign in buttons

**Authentication**
- Sign In page (email + password)
- Sign Up page (name + email + password confirmation)

**Dashboard (After Login)**
- **Campaign Start**: Upload document or paste content
- **Agent Room**: Watch 3 AI agents collaborate
- **Final Output**: View and download results

---

## 🎯 HOW TO USE

### 1. Sign Up / Log In
- Click "Sign Up" on landing page
- Enter any email and password
- Click "Create Account"
- (Or use Sign In to log back in)

### 2. Create a Campaign
- Click "+ Create New Campaign" or start from dashboard
- Paste your content in the text area, OR
- Drag & drop a PDF/image/text file
- Click "✨ Generate Campaign"

### 3. Watch Agents Work
- See Research Agent extract facts (1-2 seconds)
- See Copywriter create content (2-3 seconds)
- See Editor check quality (2-3 seconds)
- Watch activity feed in real-time

### 4. Review & Export
- View blog post, social thread, and email
- Toggle between Desktop & Mobile preview
- Copy any content to clipboard
- Click "📥 Download Campaign Kit" to export JSON

---

## 🎨 KEY PAGES

| Page | URL | Description |
|------|-----|-------------|
| Landing | / | Hero & onboarding |
| Sign In | /signin | Login form |
| Sign Up | /signup | Registration form |
| Dashboard | /dashboard | Campaign creation |
| Agent Room | /campaign | Live agent collaboration |
| Results | /results | View & export outputs |

---

## 🛠️ COMMON TASKS

### Change a Feature
1. Edit the relevant file in `src/`
2. Save the file
3. Browser auto-refreshes (Hot Module Replacement)
4. See your changes instantly

### Add a New Component
1. Create `src/components/MyComponent.jsx`
2. Create `src/components/MyComponent.css`
3. Import in your page component
4. Use with: `<MyComponent />`

### Customize Colors
1. Edit `src/styles/globals.css`
2. Change values in `:root { ... }`
3. All components automatically use new colors

### Make Agent Faster/Slower
1. Edit `src/agents/agents.js`
2. Find: `await new Promise(resolve => setTimeout(resolve, 2000));`
3. Change `2000` to milliseconds (1000 = 1 second)

---

## 📊 PROJECT STRUCTURE (Quick Reference)

```
Transform/
├── src/
│   ├── components/        # UI components
│   ├── pages/             # Page views (Landing, Auth, Dashboard)
│   ├── context/           # Global state (AppContext)
│   ├── agents/            # AI agent logic
│   ├── styles/            # Global CSS + design tokens
│   ├── App.jsx            # Main component
│   ├── main.jsx           # Entry point
│   └── index.css          # Base styles
├── public/                # Static files
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── index.html             # HTML template
```

---

## 🧭 NAVIGATION FLOW

```
Landing Page
    ↓
  Sign Up / Sign In
    ↓
  Dashboard
    ├─→ Campaign Start (upload/paste content)
    │     ↓
    │   Agent Room (watch collaboration)
    │     ↓
    │   Final Output (review & export)
    │
    └─→ Past Campaigns (view history)
```

---

## 🔧 TROUBLESHOOTING

### "npm: command not found"
- **Solution**: Install Node.js from nodejs.org
- Restart your terminal after installation

### Port 5173 already in use
- **Solution**: Kill the process or use different port
- Or just wait a moment and refresh browser

### Changes not appearing
- **Solution**: 
  1. Check browser console (F12) for errors
  2. Full refresh browser (Ctrl+Shift+R)
  3. Restart dev server (Ctrl+C then npm run dev)

### PowerShell errors
- **Solution**: Use Command Prompt (cmd) instead

### CSS not loading
- **Solution**: Check browser DevTools (Ctrl+Shift+I)
  - Look in Network tab for 404 errors
  - Check Console tab for CSS parsing errors

---

## 📱 RESPONSIVE DESIGN

All pages are mobile-friendly:
- Navbar collapses on mobile
- Grids becomes single column
- Buttons resize for touch
- Fonts scale appropriately

Test by:
1. F12 in browser
2. Click device icon (mobile preview)
3. Resize to see how layout adapts

---

## 🎓 LEARNING RESOURCES

**React Fundamentals**
- Components, JSX, Props, State
- Hooks: useState, useEffect, useContext
- Learn at: react.dev

**Vite Basics**
- Build tool for fast development
- Hot Module Replacement (HMR)
- Learn at: vite.dev

**CSS/Styling**
- CSS Variables (custom properties)
- Flexbox & Grid layouts
- CSS Animations
- Learn at: mdn.org

---

## ✅ PROJECT STATUS

✓ Landing Page
✓ Auth Pages (Sign In / Sign Up)
✓ Dashboard Layout
✓ Campaign Upload Interface
✓ Agent Collaboration System
✓ Mock AI Agents (Research, Copywriter, Editor)
✓ Output Generation
✓ Export Functionality
✓ Design System (Colors, Typography, Animations)
✓ Responsive Design

### Ready to Enhance:
- [ ] Real API integration (OpenAI, Claude, etc.)
- [ ] Database for campaign history
- [ ] User profiles & settings
- [ ] Team collaboration features
- [ ] Export to multiple formats (PDF, DOCX, etc.)
- [ ] Email integration (send directly)
- [ ] Analytics & performance tracking

---

## 📞 SUPPORT

If you encounter issues:
1. Check the README_PROJECT.md for detailed documentation
2. Review error messages in browser console (F12)
3. Check terminal output for build/server errors
4. Try restarting the dev server

---

**Happy creating! 🚀**
Last Updated: April 2, 2026
