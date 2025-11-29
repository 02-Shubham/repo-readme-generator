# 📝 GitHub README Generator

AI-powered README generator that transforms GitHub repositories into comprehensive, professional documentation in seconds.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org)

## 🚀 Features

- 🤖 **AI-Powered** - Uses Lovable AI (Gemini 2.5 Flash) to generate intelligent README content
- ⚡ **Zero Config** - No API keys needed; authentication via Lovable Cloud
- 🔍 **Smart Analysis** - Auto-detects key files (package.json, Dockerfile, etc.)
- 👀 **Live Preview** - Real-time markdown rendering with syntax highlighting
- 💾 **One-Click Download** - Export as README.md instantly
- 🎨 **Modern UI** - Dark-themed, responsive interface
- 📊 **File Provenance** - Track which files contributed to each section

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Supabase Edge Functions (Deno) + Lovable AI + GitHub API
- **Tools**: ESLint, PostCSS, React Hook Form, Zod

## 📂 Project Structure

```
repo-readme-generator/
├── public/
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Hero.tsx                    # Landing hero section
│   │   ├── NavLink.tsx                 # Navigation component
│   │   ├── Preview.tsx                 # Markdown preview panel
│   │   └── ui/                         # shadcn UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ... (25+ UI components)
│   ├── hooks/
│   │   ├── use-mobile.tsx              # Mobile detection hook
│   │   └── use-toast.ts                # Toast notification hook
│   ├── integrations/
│   │   └── supabase/
## 📂 Project Structure

```
repo-readme-generator/
├── src/
│   ├── components/          # React components (Preview, Hero, etc.)
│   ├── hooks/               # Custom hooks (use-toast, use-mobile)
│   ├── pages/               # Pages (Index, NotFound)
│   ├── lib/                 # Utilities (github.ts, utils.ts)
│   ├── integrations/        # Supabase client & types
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── supabase/
│   ├── functions/
│   │   └── generate-readme/ # Edge function for README generation
│   └── config.toml          # Configuration
└── Config files (package.json, vite.config.ts, etc.)
```
# (Provided automatically if using Lovable)

# 4. Start development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Build with development settings
npm run build:dev

# Preview production build locally
npm run preview

# Run ESLint for code quality checks
npm run lint
```

## 📋 Environment Variables

The project uses **Lovable Cloud** for seamless deployment. The following variables are automatically configured:

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase backend endpoint |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Client authentication key |
| `LOVABLE_API_KEY` | AI model access (backend only) |

No manual configuration needed! ✨

## 🎯 How It Works

### User Workflow

```
1. User enters GitHub repository URL
    ↓
2. Frontend validates input and sends to edge function
    ↓
3. Edge function fetches key files from GitHub API
    ↓
4. Files are summarized and sent to Lovable AI
    ↓
5. AI generates comprehensive README content
    ↓
6. Response with provenance is returned to frontend
    ↓
7. User previews and downloads README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/02-Shubham/repo-readme-generator.git
cd repo-readme-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Check code quality
```

## 📋 Environment Variables

Handled automatically by Lovable Cloud. No manual setup needed!## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes and push to the branch
4. Open a Pull Request

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🙋 Support

- 🐛 Open an [issue](https://github.com/02-Shubham/repo-readme-generator/issues)
- 💬 Check existing discussions

---

<div align="center">

Made with ❤️ by [Shubham](https://github.com/02-Shubham)

</div>