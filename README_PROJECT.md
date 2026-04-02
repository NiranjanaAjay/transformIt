# 🚀 Autonomous Content Factory (TransformIt) - Complete Project

A powerful React/Vite application that transforms single documents into complete multi-channel marketing campaigns using collaborative AI agents.

## 🎯 Project Overview

**TransformIt** is a playful, modern SaaS application that eliminates creative burnout by automating content repurposing across multiple channels. Users upload a document once, and three specialized AI agents work together to generate:
- 📝 **Blog Post** (~500 words)
- 👥 **Social Media Thread** (5 coordinated posts)
- 📧 **Email Teaser** (1 impactful paragraph)

## ✨ Features

### 🧠 Three Collaborative AI Agents

1. **Research & Fact-Check Agent** (🧠)
   - Extracts core features, specs, and target audience
   - Creates a structured "Fact-Sheet" JSON for consistency
   - Flags ambiguous statements

2. **Creative Copywriter Agent** (✍️)
   - Generates multiple content formats simultaneously
   - Switches between tone profiles (Professional, Engaging, etc.)
   - Ensures value proposition is prominent in all outputs

3. **Editor-in-Chief Agent** (🛡️)
   - Performs hallucination checks (verifies facts)
   - Conducts tone audits (not too salesy, not too robotic)
   - Provides specific correction notes for improvements
   - Triggers regeneration with feedback

### 🎨 UI/UX Features

- **Playful Design System**: Pastel colors, hand-drawn doodles, soft gradients
- **Live Agent Collaboration**: Watch agents think, work, and complete tasks
- **Activity Feed**: Real-time log of agent interactions
- **Multi-Format Output Preview**: Blog, social thread, email side-by-side
- **Responsive Preview**: Desktop and mobile simulations
- **One-Click Export**: Download complete campaign as JSON
- **Smooth Animations**: Floating blobs, typing dots, confetti success states

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard layout & navbar
│   ├── CampaignStart.jsx      # File upload & content input
│   ├── AgentRoom.jsx          # Agent collaboration visualization
│   ├── FinalOutput.jsx        # Results viewing & export
│   ├── UI.jsx                 # Reusable UI components
│   ├── Navbar.jsx             # Navigation component
│   └── *.css                  # Component styles
├── pages/
│   ├── LandingPage.jsx        # Hero & onboarding
│   ├── AuthPages.jsx          # Sign in/Sign up
│   └── *.css                  # Page styles
├── context/
│   └── AppContext.jsx         # Global state management
├── agents/
│   └── agents.js              # AI agent logic
├── styles/
│   └── globals.css            # Global design tokens & utilities
├── App.jsx                    # Main app component
├── App.css                    # App styles
├── main.jsx                   # Entry point
├── index.css                  # Base styles
└── vite.config.js             # Vite configuration
```

## 🎨 Design System

### Colors (Pastel Palette)
- Pink: `#FFD6E0`
- Blue: `#D6F0FF`
- Yellow: `#FFF4C2`
- Purple: `#E6D6FF`
- Green: `#D6FFE3`
- Orange: `#FFE5CC`

### Typography
- **Headings**: Fredoka (playful, funky)
- **Body**: Inter (clean, readable)

### Animations
- `bounce`: Vertical bouncing motion
- `float`: Smooth floating effect
- `wiggle`: Small rotation wiggle
- `pulse`: Opacity fade
- `typing`: Animated typing dots
- `confetti`: Falling confetti burst

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone/Navigate to project**:
   ```bash
   cd Desktop/Transform
   ```

2. **Install dependencies**:
   ```bash
   npm install react-router-dom axios
   # or if npm install doesn't work:
   # Manually add these to package.json and run: npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173` (or the URL shown in terminal)

4. **Build for production**:
   ```bash
   npm run build
   npm run preview
   ```

### Troubleshooting PowerShell Issues

If you encounter PowerShell execution policy errors:

**Option 1: Use Command Prompt (cmd) instead**
```cmd
cd c:\Users\NIRANJANA\Desktop\Transform
npm run dev
```

**Option 2: Bypass PowerShell policy (temporary)**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

**Option 3: Permanently change policy (use with caution)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📖 Usage Guide

### 1. **Landing Page** (`/landing`)
- Hero section with animated title
- "How It Works" explanation
- Feature highlights
- CTA buttons to sign up/sign in

### 2. **Authentication** (`/signin`, `/signup`)
- Email/password authentication
- Split-screen layout with decorative illustrations
- Form validation

### 3. **Dashboard** (`/dashboard`)
- Navbar with logo, navigation, and profile
- Campaign start interface with:
  - Large text area for pasting content
  - Drag-and-drop file upload (PDF, images, text)
  - "Generate Campaign" button

### 4. **Agent Room** (`/campaign`)
- Three agent cards showing real-time state:
  - 🟢 Idle (Ready)
  - 🟡 Thinking/Working (animated dots)
  - 🟢 Completed (checkmark)
- Activity feed with timestamped logs
- Live rejection notes with feedback
- Automatic regeneration on feedback

### 5. **Final Output** (`/results`)
- **Tabs** for Blog, Social, Email outputs
- **Side panel** with:
  - Source document preview
  - Desktop/Mobile preview toggle
  - Export button (downloads JSON)
  - New Campaign button
- **Comparison view**: Source vs. Generated Output side-by-side
- **Mobile preview**: Phone mockup simulation for social content

## 🤖 Agent Logic Details

### Research Agent Flow
1. Analyzes source document
2. Extracts features using regex patterns
3. Identifies target audience
4. Detects tone (professional/casual/neutral)
5. Flags ambiguous statements
6. Returns structured Fact-Sheet JSON

### Copywriter Agent Flow
1. Receives Fact-Sheet from Research
2. Generates blog post (~500 words):
   - Compelling intro
   - Feature breakdown with benefits
   - Impact section
   - Conclusion with CTA
3. Generates social thread (5 posts):
   - Teaser tweet
   - Feature spotlight
   - Demo/benefit post
   - Stats/proof post
   - CTA post
4. Generates email teaser (90-120 words):
   - Subject line
   - Compelling hook
   - Feature mention
   - CTA link

### Editor Agent Flow
1. Receives all drafts
2. Performs checks:
   - **Hallucination**: Verifies facts match Fact-Sheet
   - **Tone**: Checks for salesy/robotic language
   - **Length**: Validates content length requirements
3. Returns approval status or specific correction notes
4. Triggers regeneration if rejected

## 🎛️ State Management

Global app state managed via React Context (`AppContext`):

```javascript
{
  currentPage,           // 'landing' | 'signin' | 'signup' | 'dashboard' | 'campaign' | 'results'
  user,                  // { email, name }
  campaigns,             // Array of past campaigns
  currentCampaign,       // { id, stage, sourceDocument, createdAt }
  sourceDocument,        // Raw input text
  factSheet,             // Extracted facts JSON
  outputs,               // { blog, social[], email }
  agentStates,           // { research, copywriter, editor } - each: 'idle'|'thinking'|'working'|'completed'
  activityFeed,          // Array of { agent, message, timestamp }
  approvalStatus,        // { blog, social, email } - each: 'approved'|'rejected'|null
}
```

## 🎨 Customization Guide

### Change Brand Name
Replace "TransformIt" and "✨" throughout:
- `src/pages/LandingPage.jsx`
- `src/components/Dashboard.jsx`
- `src/index.html` (page title)

### Modify Color Palette
Edit in `src/styles/globals.css`:
```css
:root {
  --color-pink: #FFD6E0;    /* Your color */
  --color-blue: #D6F0FF;    /* Your color */
  /* ... etc */
}
```

### Adjust Agent Processing Time
In `src/agents/agents.js`:
```javascript
await new Promise(resolve => setTimeout(resolve, 2000)); // Change milliseconds
```

### Customize Output Templates
Modify generator functions in `src/agents/agents.js`:
- `generateBlogPost()`
- `generateSocialThread()`
- `generateEmailTeaser()`

## 📊 API Integration (Future Enhancement)

Current implementation uses mock/local AI agents. To integrate real APIs:

### Option 1: OpenAI/Claude API
```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${API_KEY}` },
  body: JSON.stringify({ /* prompt */ })
});
```

### Option 2: Backend Server
```javascript
const response = await fetch('/api/agents/research', {
  method: 'POST',
  body: JSON.stringify({ sourceDocument })
});
```

### Option 3: Model Context Protocol (MCP)
Integrate with MCP servers for specialized agent capabilities.

## 🔒 Security Considerations

- **File Upload**: Implement file size limits and type validation
- **API Keys**: Never commit API keys; use environment variables
- **Input Sanitization**: Sanitize document content before processing
- **Rate Limiting**: Implement user-based rate limiting
- **Authentication**: Add JWT tokens for secure sessions

## 📦 Dependencies

### Core
- `react@^19.2.4` - UI framework
- `react-dom@^19.2.4` - DOM rendering

### Build Tools
- `vite@^8.0.1` - Build tool
- `@vitejs/plugin-react@^6.0.1` - React plugin

### Dev Dependencies
- `eslint@^9.39.4` - Code linting
- TypeScript types for React

### Optional (not installed but recommended)
- `react-router-dom` - Client-side routing
- `axios` - HTTP requests
- `zustand` / `redux` - Alternative state management

## 🧪 Testing (TODO)

Add tests using:
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

Example test:
```javascript
import { render, screen } from '@testing-library/react';
import { LandingPage } from './pages/LandingPage';

test('renders hero title', () => {
  render(<LandingPage />);
  expect(screen.getByText(/Temp/i)).toBeInTheDocument();
});
```

## 📝 Development Workflow

1. **Create new component**: Add to `src/components/` or `src/pages/`
2. **Add styling**: Co-locate CSS file (e.g., `Component.css`)
3. **Use global styles**: Import `src/styles/globals.css` once in App.jsx
4. **Test in browser**: `npm run dev` and navigate to component
5. **Optimize**: Use React DevTools and Lighthouse profiler

##🚀 Deployment

### Vercel (Recommended for Vite + React)
```bash
npm install -D vercel
vercel
```

### Netlify
```bash
npm run build
# Drag-and-drop dist/ folder to Netlify
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## 🐛 Troubleshooting

### Issue: Agents take forever to complete
**Solution**: Reduce timeout delays in `src/agents/agents.js`

### Issue: Styling not applying
**Solution**: Ensure `src/styles/globals.css` is imported in `App.jsx`

### Issue: State not updating
**Solution**: Use `useAppContext()` hook correctly; ensure Provider wraps app

### Issue: Images not loading
**Solution**: Place images in `public/` folder and reference with `/filename`

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vite.dev)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Web Fonts](https://fonts.google.com)

## 📄 License

MIT License - Feel free to use, modify, and distribute

---

**Built with ❤️ by Your AI Assistant**

Last Updated: April 2, 2026
