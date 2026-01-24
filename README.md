# EnoAI

EnoAI is an AI-powered personal wine assistant that helps users choose the right wine with expert-level guidance. By uploading a photo or PDF of a wine menu and briefly describing the meal, users receive tailored wine pairing recommendations along with insights into each selection, making the wine selection process simple, informed, and accessible both at home and in restaurants.

This project represents an MVP of EnoAI and will continue to evolve with additional features and improvements in future iterations.

## Features

- 🍷 AI-powered wine recommendations
- 🌍 Multi-language support 
- 💬 Interactive chat interface
- ⭐ Save favorite wines to your profile

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following:
   ```env
   VITE_SUPABASE_URL=https://xocflqvamviwgcowfnia.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvY2ZscXZhbXZpd2djb3dmbmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzY4MjcsImV4cCI6MjA3Nzg1MjgyN30.bDsk163chm_InxkcDgFs6NSUAHEx2wMa5wsMxVcUxMQ
   VITE_SUPABASE_PROJECT_ID=xocflqvamviwgcowfnia
   ```

   > **Note**: The AI functionality is powered by Lovable Cloud's backend. The `LOVABLE_API_KEY` is configured on the server-side and doesn't need to be set locally.

4. **Start the development server**
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

