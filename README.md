# EnoAI - Wine Recommendation Assistant

An AI-powered wine recommendation chatbot that helps users discover wines based on their preferences, food pairings, and occasions.

## Features

- 🍷 AI-powered wine recommendations
- 📸 Image recognition for wine labels
- 🌍 Multi-language support (English, Spanish, Portuguese, French)
- 💬 Interactive chat interface
- ⭐ Save favorite wines to your profile

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the app.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Lovable Cloud (Supabase)
- **AI**: Google Gemini for wine recommendations

## Project Structure

```
src/
├── components/       # React components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
└── integrations/     # External service integrations

supabase/
└── functions/        # Backend edge functions
```

## Deployment

Simply open [Lovable](https://lovable.dev/projects/e268321d-3edb-4071-a3ba-f9f0bd68f68e) and click on Share → Publish.

## Custom Domain

To connect a custom domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
