# AI Career Copilot — AI-Powered Interview Preparation Platform

**AI Career Copilot** is a modern, responsive, client-side web application designed to help job seekers and students practice spoken mock interviews, parse their resumes in-browser, and receive structured, actionable feedback using the STAR (Situation, Task, Action, Result) methodology.

---

## 🚀 Key Features

1. **In-Browser Resume Analyzer (PDF, DOCX, TXT)**
   - 100% Client-Side extraction powered by `pdfjs-dist` and `mammoth.js`.
   - Automatic detection of technical skills, frameworks, tools, education credentials, and years of experience.
   - Text editing capability to refine or append details before analyzing.
   - Zero server uploads: Your resume never leaves your browser.

2. **Job Role Selection & Targeted Setup**
   - 6 Pre-configured industry job profiles:
     - **Frontend Developer**
     - **Full Stack Developer**
     - **Java Developer**
     - **Data Analyst**
     - **Customer Support Executive**
     - **UI/UX Designer**
   - 3 Difficulty levels: **Beginner**, **Intermediate**, **Advanced**.
   - 4 Interview formats: **Technical**, **Behavioral**, **HR**, and **Mixed**.
   - Real-time skill overlap matrix comparing your resume with the selected role.
   - Custom job description input to paste target company job specs.

3. **Distraction-Free Voice Interview Room**
   - **Text-to-Speech (TTS):** Browser SpeechSynthesis API audibly speaks questions with natural pacing.
   - **Speech-to-Text (STT):** Web Speech API transcribes candidate spoken answers in real-time.
   - **Visual Waveform & Pulsing Mic:** Intuitive visual feedback for speaking, listening, and evaluating states.
   - **Text Input Fallback:** Full keyboard input support for browsers or environments without microphone access.
   - **Transcript Editing:** Candidates can edit their spoken answers before final submission.
   - Repeat Question, Skip Question, and Session Timer controls.

4. **Detailed Performance Evaluation & Reporting**
   - Instant score calculations across **Relevance**, **Completeness**, **Communication**, and **Technical Depth**.
   - Candidate strengths and specific areas to refine.
   - Suggested model answers and structured STAR answers.
   - Export and Print-friendly styling (`window.print()`).

5. **Local Session History & Privacy**
   - Stored in browser `localStorage` with zero backend requirements.
   - View previous interview reports, compare scores, and delete individual records or clear history.

6. **Multi-Platform AI Engine (Google Gemini, OpenAI ChatGPT, xAI Grok, Anthropic Claude, & Demo Mode)**
   - **⚡ High-Fidelity Demo Mode (Default):** Runs immediately offline with zero keys, utilizing tailored question banks and high-accuracy STAR evaluations.
   - **✨ Google Gemini:** Connect to Google AI Studio for Gemini 2.5/3.8 Flash generative questions.
   - **🤖 OpenAI (ChatGPT):** Connect your OpenAI API key to use GPT-4o and GPT-4o Mini.
   - **🚀 xAI (Grok):** Connect your xAI API key for Grok 2 reasoning and critique.
   - **🧠 Anthropic (Claude):** Connect your Anthropic API key for Claude 3.5 Sonnet and Haiku models.
   - **Live Connection Testing:** Test your API key with a live ping before starting practice.

---

## 🛠️ Technology Stack

- **Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (Modern lavender/purple SaaS aesthetic)
- **Icons:** Lucide React
- **Document Parsing:** `pdfjs-dist`, `mammoth`
- **Speech APIs:** Web Speech API (`SpeechRecognition`), `window.speechSynthesis`
- **Celebration Effects:** `canvas-confetti`
- **Persistence:** Browser `localStorage`

---

## 🔒 Security & Privacy Architecture

- **No Backend / No Remote Database:** User data, resume text, and interview answers remain strictly within your browser.
- **Client-Side API Key Safety:** If testing with Google Gemini in development, keys are kept solely in browser state. For public production deployments, API calls should be routed through a server-side API proxy to keep credentials secure.

---

## 🌐 Browser Compatibility

- **Speech Recognition (STT):** Google Chrome, Microsoft Edge, Brave, and Chromium-based browsers have built-in support for the Web Speech API.
- **Speech Synthesis (TTS):** Supported across Chrome, Edge, Safari, and Firefox.
- **Fallbacks:** In browsers where microphone speech recognition is restricted or unsupported, the interface automatically presents the keyboard typing fallback so mock interviews are always accessible.

---

## 💻 Setup & Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```
