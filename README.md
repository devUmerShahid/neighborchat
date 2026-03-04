# NeighborChat

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</p>

## 📖 Overview
NeighborChat is a modern, mobile-first Web Application built to foster local community connections. Inspired by popular messaging platforms like WhatsApp, it features a premium, responsive UI design, ensuring smooth user experiences across devices. Combining real-time communication, room-based features, and geolocation, it allows users to connect with their neighbors dynamically.

## ✨ Features
- **Modern UI/UX**: Premium, mobile-first design tailored for clean user interactions.
- **Real-Time Messaging**: Fast and reliable chatting capabilities powered by Supabase Realtime.
- **Room-Based Architecture**: Users can join and interact in specific topic-based or local chat rooms.
- **Authentication**: Secure Login and Signup workflows managing user sessions reliably.
- **Geolocation Integration**: Location-aware features for matching nearby users natively (`useGeolocation`).
- **PWA Ready**: Built to be suitable for Progressive Web App integrations.

## 🛠️ Tech Stack
- **Frontend Framework**: React 19 (via Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **Backend Services**: Supabase (PostgreSQL, Realtime, Auth)

## 📁 Project Structure
```text
neighborChat/
├── src/
│   ├── assets/       # Static files and images
│   ├── components/   # Reusable UI components (BottomNav, ChatBubble, etc.)
│   ├── contexts/     # React Context for global state management (Auth, etc.)
│   ├── hooks/        # Custom React hooks (useGeolocation, etc.)
│   ├── pages/        # Main application views/pages (ChatRoom, Profile, etc.)
│   ├── services/     # API and external integrations (Supabase client)
│   ├── utils/        # Helper functions
│   ├── types.ts      # Global TypeScript definitions
│   └── main.tsx      # Application entry point
├── package.json      # Dependencies and scripts
└── vite.config.ts    # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm
- Supabase Account (for database and backend services)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/devUmerShahid/neighborchat
   cd neighborChat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Supabase credentials. You must map the variables as they are exposed to your Vite application:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## 📦 Scripts
- `npm run dev` - Starts the local development server with Hot Module Replacement (HMR).
- `npm run build` - Compiles TypeScript and builds the app for production.
- `npm run lint` - Lints the codebase utilizing ESLint.
- `npm run preview` - Locally preview the created production build.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
If you intend to add new features or fix bugs, please branch out from the `main` branch, make your commits cleanly, and open a standard Pull Request targetting `main`.

## 📄 License
This project is licensed under the MIT License.
