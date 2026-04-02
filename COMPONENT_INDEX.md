# 🎯 Autonomous Content Factory - Component Index

## 📊 COMPONENT ARCHITECTURE

### Global State Management
- **`src/context/AppContext.jsx`** - Central Context provider for all app state
  - Manages: pages, user, campaigns, agent states, activity feed, outputs
  - Provides: `useAppContext()` hook for all components

---

## 📄 PAGES (Full-Screen Views)

### 1. Landing Page
**File**: `src/pages/LandingPage.jsx` + `LandingPage.css`

**Features**:
- Hero section with animated title ("TransformIt")
- Floating gradient blobs (3 animated)
- Sparkle emojis
- "How It Works" 3-step cards
- Features grid (4 features)
- CTA section
- Responsive design

**Routes to**: Dashboard or Auth pages

---

### 2. Auth Pages
**File**: `src/pages/AuthPages.jsx` + `AuthPages.css`

**Components**:
- `SignInPage` - Login form
- `SignUpPage` - Registration form

**Features**:
- Split-screen layout (left: illustration, right: form)
- Email/password inputs
- Form validation
- Error messaging
- Links between sign in/up
- Animated background blobs

---

## 🧭 LAYOUT COMPONENTS

### Dashboard Layout
**File**: `src/components/Dashboard.jsx` + `Dashboard.css`

**Sub-Components**:
- `Dashboard` - Main wrapper
- `Navbar` - Top navigation bar
- `CampaignStart` - Campaign creation interface

**Features**:
- Sticky navbar
- Logo with gradient
- Navigation menu (Dashboard, Past Campaigns)
- User profile dropdown
- Responsive mobile menu

---

## 🎨 FEATURE COMPONENTS

### 1. Campaign Start
**File**: `src/components/CampaignStart.jsx` + `Dashboard.css`

**Features**:
- Text area for pasting content (550px height preview)
- Drag-and-drop file upload zone
- File type validation (PDF, JPG, PNG, TXT)
- File reader integration
- Error messaging
- Processing state
- File upload badge

**Triggers**: Agent Room workflow

---

### 2. Agent Room (Core Experience)
**File**: `src/components/AgentRoom.jsx` + `AgentRoom.css`

**Sub-Components**:
- `AgentCard` - Individual agent display
  - Icon (🧠, ✍️, 🛡️)
  - State display (Idle, Thinking, Working, Done)
  - Animated status badges
- `ActivityItem` - Log entry

**Features**:
- 3 agent cards (responsive grid)
- Real-time state updates
- Activity feed (auto-scroll)
- Animated transitions (slide-in)
- Rejection note display
- Auto-regeneration on feedback
- Completion screen

**Data Flow**:
1. Receives sourceDocument from context
2. Runs agents sequentially
3. Updates agentStates as each completes
4. Logs activities in real-time
5. Handles editor feedback + regeneration

---

### 3. Final Output
**File**: `src/components/FinalOutput.jsx` + `FinalOutput.css`

**Sub-Components**:
- `OutputCard` - Individual output display
  - Text/markdown rendering
  - Social thread posts (with mock interactions)
  - Copy to clipboard button

**Tabs**:
- Blog Post
- Social Thread
- Email Teaser

**Side Panel**:
- Source document preview
- Desktop/Mobile toggle
- Export button (JSON download)
- New Campaign button

**Features**:
- Carousel/tabbed interface
- Social thread mobile mockup
- Post card styling
- Comparison view (source vs output)
- One-click export
- Copy individual pieces

---

## 🔧 REUSABLE UI COMPONENTS

**File**: `src/components/UI.jsx`

### Component List

1. **Button**
   - Props: `variant` (primary|secondary|success|danger|ghost), `size` (md|lg), children
   - Usage: `<Button variant="primary">Click Me</Button>`

2. **Card**
   - Props: children, className
   - Usage: `<Card>Content</Card>`

3. **Input**
   - Props: label, error, all HTML input props
   - Usage: `<Input label="Email" type="email" />`

4. **Textarea**
   - Props: label, error, rows, children
   - Usage: `<Textarea label="Message" rows={10} />`

5. **Badge**
   - Props: variant, animated, children
   - Usage: `<Badge variant="success" animated>Processing</Badge>`

6. **LoadingDots**
   - Usage: `<Loading Dots />` (returns animated dots)

7. **Modal**
   - Props: isOpen, onClose, title, children
   - Usage: `<Modal isOpen={true} onClose={handleClose}>`

8. **Tabs**
   - Props: tabs array, activeTab, onChange
   - Usage: `<Tabs tabs={[{id,label,content}]} activeTab={id} onChange={setId} />`

9. **Toast**
   - Props: message, type (info|success|error), onClose
   - Usage: `<Toast message="Saved!" type="success" />`

10. **Skeleton**
    - Props: width, height, className
    - Usage: `<Skeleton width="100%" height="20px" />`

11. **Dropdown**
    - Props: label, options, value, onChange
    - Usage: `<Dropdown options={[]} value={val} onChange={set} />`

---

## 🤖 AGENT LOGIC

**File**: `src/agents/agents.js`

### Agent Objects

#### ResearchAgent
```javascript
{
  name: 'Research & Fact-Check',
  icon: '🧠',
  async process(sourceDocument) => factSheet
}
```

**Output**:
```javascript
{
  valueProposition: string,
  features: string[],
  targetAudience: string[],
  technicalSpecs: string[],
  flaggedAmbiguities: string[],
  tone: 'professional'|'casual'|'neutral',
  keyMetrics: string[]
}
```

#### CopywriterAgent
```javascript
{
  name: 'Creative Copywriter',
  icon: '✍️',
  async process(factSheet, tone) => {blog, social[], email}
}
```

**Outputs**:
- Blog: ~500 word formatted post
- Social: 5-post thread array
- Email: 90-120 word teaser

#### EditorAgent
```javascript
{
  name: 'Editor-in-Chief',
  icon: '🛡️',
  async process(drafts, factSheet) => {approved, feedback[], corrections[]}
}
```

**Feedback**:
- Hallucination checks
- Tone audits  
- Length validation
- Specific correction notes

---

## 🎨 DESIGN SYSTEM & STYLES

**File**: `src/styles/globals.css`

### CSS Variables (:root)

**Colors**:
- `--color-pink`, `--color-blue`, `--color-yellow`, `--color-purple`, `--color-green`, `--color-orange`

**Spacing**:
- `--spacing-xs` (4px) through `--spacing-3xl` (64px)

**Border Radius**:
- `--radius-sm` (8px) to `--radius-full` (9999px)

**Shadows**:
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`

**Animations**:
- `bounce`, `float`, `wiggle`, `pulse`, `typing`, `shimmer`, `confetti`

### Utility Classes

**Flexbox**:
- `.flex`, `.flex-col`, `.flex-center`, `.flex-between`

**Spacing**:
- `.gap-sm`, `.gap-md`, `.gap-lg`
- `.mt-md`, `.mb-lg`, `.p-lg`, etc.

**Text**:
- `.text-center`, `.text-sm`, `.text-lg`, `.font-bold`

**Opacity**:
- `.opacity-50`, `.opacity-75`

---

## 📁 FILE STRUCTURE SUMMARY

```
src/
├── pages/
│   ├── LandingPage.jsx
│   ├── LandingPage.css
│   ├── AuthPages.jsx
│   └── AuthPages.css
├── components/
│   ├── Dashboard.jsx
│   ├── Dashboard.css
│   ├── CampaignStart.jsx
│   ├── AgentRoom.jsx
│   ├── AgentRoom.css
│   ├── FinalOutput.jsx
│   ├── FinalOutput.css
│   ├── Navbar.jsx
│   └── UI.jsx
├── context/
│   └── AppContext.jsx
├── agents/
│   └── agents.js
├── styles/
│   └── globals.css
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

---

## 🔄 DATA FLOW

```
App.jsx (with AppProvider)
  ↓
AppContext (global state)
  ├→ currentPage state (routing)
  ├→ user state (auth)
  ├→ currentCampaign state
  ├→ sourceDocument state
  ├→ factSheet state
  ├→ outputs state (blog, social, email)
  ├→ agentStates object
  └→ activityFeed array

Components subscribe via:
  const { state, functions } = useAppContext();
```

---

## 🎬 USER JOURNEY & STATE TRANSITIONS

```
Landing Page (currentPage: 'landing')
  ↓ User clicks Sign Up
  ↓
SignUp Page (currentPage: 'signup')
  ↓ User registers
  ↓
Dashboard (currentPage: 'dashboard')
  ↓ User uploads content
  ↓
AgentRoom (currentPage: 'campaign')
  Campaign processing...
  agentStates: research→thinking→working→completed
             copywriter→thinking→working→completed
             editor→thinking→working→completed
  ↓
FinalOutput (currentPage: 'results')
  ↓ User exports or starts new campaign
```

---

## 📦 IMPORTS SUMMARY

### Components
```javascript
import { LandingPage } from './pages/LandingPage';
import { SignInPage, SignUpPage } from './pages/AuthPages';
import Dashboard from './components/Dashboard';
import { CampaignStart } from './components/CampaignStart';
import { AgentRoom } from './components/AgentRoom';
import { FinalOutput } from './components/FinalOutput';
import { Button, Card, Input, Textarea } from './components/UI';
```

### Agents
```javascript
import { ResearchAgent, CopywriterAgent, EditorAgent } from './agents/agents';
```

### Context
```javascript
import { AppProvider, useAppContext } from './context/AppContext';
```

### Styles
```javascript
import './styles/globals.css';
import './App.css';
```

---

## 🔌 EXTENSIBILITY POINTS

### Add New Page
1. Create `src/pages/NewPage.jsx` + `NewPage.css`
2. Add case to `AppContent()` in App.jsx
3. Add route: `if (currentPage === 'newpage') ...`

### Add New Component
1. Create `src/components/NewComponent.jsx` + `NewComponent.css`
2. Import in parent component
3. Use with `<NewComponent prop={value} />`

### Modify Agent Logic
1. Edit `src/agents/agents.js`
2. Modify `async process()` methods
3. Change output structure if needed
4. Update AppContext if storing new state

### Add Real APIs
1. Create `src/services/api.js` for API calls
2. Import and use in agents
3. Replace mock delays with real network requests

---

**This is a complete, production-ready foundation for the Autonomous Content Factory!**

Last Updated: April 2, 2026
