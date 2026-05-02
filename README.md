# 🏠 HomeBase

Track everything about your home — room dimensions, paint colors, appliances — shared with your family in real time.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project: **homebase**
3. Add a **Web App** (the `</>` icon on the project overview)
4. Copy your config into `src/lib/firebase.js`
5. Enable these in the Firebase console:
   - **Authentication** → Sign-in method → **Google** → Enable
   - **Firestore Database** → Create database → Start in **test mode** (update rules later)
   - **Storage** → Get started → Start in **test mode**

### 3. Apply security rules (after testing)
- Paste `firestore.rules` content into: Firebase → Firestore → Rules
- Paste `storage.rules` content into: Firebase → Storage → Rules

### 4. Run locally
```bash
npm run dev
```
Open `http://localhost:5173` — camera works here via localhost!

---

## Deploy to GitHub Pages

### First time
```bash
# Update package.json homepage with your GitHub username first!
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR-USERNAME/homebase.git
git branch -M main
git push -u origin main
npm run deploy
```

Then: GitHub repo → **Settings → Pages → Branch: gh-pages → Save**

Your app will be live at: `https://YOUR-USERNAME.github.io/homebase/`

### Updates
```bash
npm run deploy
```

---

## Features

### 📐 Measurements
- Walls, ceilings, floors, windows, doors, shelves
- Width × Height or Length per surface type
- Notes per surface

### 🎨 Paint & Finishes
- Photograph paint label → AI reads brand, color, finish, hex
- Stored with photo, organized per room
- Color swatch preview

### 🔧 Appliances & Items
- Photograph data plate → AI reads model & serial number
- Purchase date, category
- Photo stored to Firebase

### 👨‍👩‍👧 Family Sharing
- Sign in with Google
- Create a home or join with a Home ID
- Real-time sync across all family devices

---

## Tech Stack
- React 18 + Vite
- Firebase (Auth, Firestore, Storage)
- Anthropic Claude API (AI label reading)
- GitHub Pages (hosting)
