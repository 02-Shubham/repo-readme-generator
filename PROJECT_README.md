# GitHub README Generator

A clean, developer-focused web app that generates comprehensive README files for GitHub repositories using AI. Built with React, TypeScript, and Lovable Cloud.

## Features

- **Zero-config AI integration**: Uses Lovable AI (Gemini 2.5 Flash) - no API keys needed
- **Smart file analysis**: Automatically detects and analyzes key project files (package.json, requirements.txt, Dockerfile, workflows, etc.)
- **Live preview**: See your generated README in real-time with proper markdown rendering
- **One-click download**: Export your README.md instantly
- **Clean UI**: Dark-themed, code-editor inspired interface

## How It Works

1. **Input**: Paste any public GitHub repository URL (e.g., `https://github.com/vercel/next.js`)
2. **Analysis**: The app fetches key files using GitHub's REST API:
   - Root files: `package.json`, `README.md`, `pyproject.toml`, `requirements.txt`, `Dockerfile`, etc.
   - CI/CD configs: `.github/workflows/*.yml`
3. **Generation**: Files are summarized and sent to Lovable AI to generate a structured README with:
   - Project title and description
   - Quick start instructions
   - Usage examples
   - Configuration details
   - Contributing guidelines
   - License info
4. **Preview & Download**: View the generated markdown and download it as `README.md`

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with custom dark theme
- **react-markdown** - Markdown preview rendering
- **shadcn/ui** - UI component library

### Backend (Lovable Cloud)
- **Deno Edge Functions** - Serverless backend
- **Lovable AI Gateway** - AI model access (Gemini 2.5 Flash)
- **GitHub REST API** - Repository file fetching

## Getting Started

### Prerequisites
- Node.js 18+ and npm installed ([install guide](https://github.com/nvm-sh/nvm))
- A Lovable account (this project uses Lovable Cloud)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-directory>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Environment Variables

This project uses **Lovable Cloud**, which automatically provisions:
- `VITE_SUPABASE_URL` - Backend API endpoint
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Client authentication
- `LOVABLE_API_KEY` - AI model access (backend only)

No manual environment configuration needed! ✨

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Preview.tsx          # Markdown preview with custom styling
│   │   └── ui/                  # shadcn UI components
│   ├── lib/
│   │   └── github.ts            # GitHub API integration utilities
│   ├── pages/
│   │   └── Index.tsx            # Main application page
│   └── index.css                # Design system & theme
├── supabase/
│   ├── functions/
│   │   └── generate-readme/
│   │       └── index.ts         # Edge function for README generation
│   └── config.toml              # Function configuration
└── tailwind.config.ts           # Tailwind theme customization
```

## Key Files Explained

### `src/lib/github.ts`
Handles all GitHub API interactions:
- `parseRepoUrl()` - Extracts owner/repo from GitHub URLs
- `fetchRepoFiles()` - Lists repository contents
- `getFileContent()` - Fetches and decodes file contents
- `fetchKeyFiles()` - Orchestrates fetching of important project files

### `supabase/functions/generate-readme/index.ts`
Backend edge function that:
1. Validates and parses GitHub repository URLs
2. Fetches key files from the repository
3. Assembles a compact prompt (max ~3000 chars)
4. Calls Lovable AI to generate README content
5. Returns README with file provenance

### `src/components/Preview.tsx`
Markdown preview component with:
- Custom styling for all markdown elements
- Syntax highlighting for code blocks
- Responsive layout
- Download functionality

## Usage Example

```typescript
// The app calls the edge function like this:
const { data, error } = await supabase.functions.invoke('generate-readme', {
  body: { repoUrl: 'https://github.com/vercel/next.js' }
});

// Returns:
{
  readme: "# Next.js\n\nThe React Framework...",
  provenance: [
    { file: "package.json", reason: "install scripts and dependencies" },
    { file: "README.md", reason: "existing documentation" }
  ]
}
```

## Configuration

### Customizing the AI Model

Edit `supabase/functions/generate-readme/index.ts` to change models:

```typescript
// Current: Gemini 2.5 Flash (balanced, fast)
model: 'google/gemini-2.5-flash'

// Alternatives:
model: 'google/gemini-2.5-pro'        // More powerful reasoning
model: 'google/gemini-2.5-flash-lite' // Faster, cheaper
model: 'openai/gpt-5-mini'            // OpenAI alternative
```

### GitHub Rate Limits

For higher rate limits, add a GitHub token in the edge function:

```typescript
// In fetchRepoFiles():
headers: {
  'Authorization': `token ${YOUR_GITHUB_TOKEN}`
}
```

## Deployment

This app uses Lovable Cloud's automatic deployment:

1. **Frontend**: Click "Publish" in Lovable editor → "Update" to deploy UI changes
2. **Backend**: Edge functions deploy automatically on save

### Custom Domain

Connect your own domain in Project → Settings → Domains (requires paid plan)

## Limitations

- Only works with **public** GitHub repositories
- GitHub API rate limit: 60 requests/hour (unauthenticated) or 5,000/hour (with token)
- Generated READMEs are AI-based - always review before using in production
- File summaries limited to first 400 characters to keep prompts compact

## Contributing

Contributions welcome! Key areas for improvement:
- Support for private repositories (GitHub OAuth)
- More file type detection (Maven, Gradle, Swift, etc.)
- README templates by project type
- Customizable sections
- Multi-language support

## License

MIT License - feel free to use this in your own projects!

## Troubleshooting

### "GitHub API error: 404"
- Verify the repository URL is correct and the repo is public
- Check if the repository exists

### "AI generation failed"
- Ensure Lovable Cloud is enabled (automatic in this project)
- Check edge function logs in Lovable Cloud → Functions tab

### Rate limiting
- GitHub: Wait an hour or add a GitHub token
- Lovable AI: Check workspace usage in Settings → Workspace → Usage

## Learn More

- [Lovable Cloud Documentation](https://docs.lovable.dev/features/cloud)
- [Lovable AI Documentation](https://docs.lovable.dev/features/ai)
- [GitHub REST API](https://docs.github.com/en/rest)

---

Built with ❤️ using [Lovable](https://lovable.dev)
