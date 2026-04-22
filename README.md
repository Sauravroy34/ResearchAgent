# ⚡ Research Agent

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Chakra UI](https://img.shields.io/badge/Chakra--UI-3.34-319795?logo=chakraui&logoColor=white)](https://chakra-ui.com/)
[![Gemini](https://img.shields.io/badge/Google--Gemini-2.5--Flash-4285F4?logo=googlegemini&logoColor=white)](https://aistudio.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://research-agent-nine-gamma.vercel.app/)


> **Live Demo**: [research-agent-nine-gamma.vercel.app](https://research-agent-nine-gamma.vercel.app/)

A premium, high-performance research assistant interface powered by **Google Gemini**, **LangChain**, and **MCP**. This application provides a seamless, multi-modal chat experience designed for deep analysis, document reasoning, and real-time research.

---

## ✨ Key Features

- 🧠 **Multi-Modal Reasoning**: Upload and analyze images, PDFs, text documents, CSVs, JSON, and Word files directly in the chat.
- ⚡ **Powered by Gemini 2.5**: Choose between Gemini 2.5 Pro (Brain), Flash (Fast), and Flash-Lite (Lightweight) for tailored responses.
- 🔍 **Real-time Research**: Leveraging advanced agentic workflows to browse and synthesize information from across the web.
- 🎨 **Premium UI/UX**: Dark-themed, responsive design with glassmorphism, fluid animations (Framer Motion), and intuitive navigation.
- 🔒 **Session Integrity**: Securely initialize your session with your own API key—keys are never stored on the server.

---

## 🛠️ Technical Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Chakra UI v3, Framer Motion (Animations)
- **Content**: React Markdown with GFM support
- **Backend API**: Hosted LangChain Agent via Hugging Face Space
- **Core Logic**: Google Gemini API, MCP (Model Context Protocol)
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0 or higher
- **Google AI API Key**: Obtain yours from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sauravroy34/ResearchAgent.git
   cd ResearchAgentUI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## 📖 Usage Guide

1. **Initialization**: On the first launch, enter your **Google API Key** and select your preferred **Gemini Model**.
2. **Chat**: Start asking questions! You can use the 📎 icon to attach files for analysis.


---

## MCP server 
For more info about the mcp server and backend used check out my this project https://github.com/Sauravroy34/ResearchPaperMCP



