# Voice Computer Control

A voice-native interface for controlling your computer using Cubby and Claude's Computer Use API.

## What This Does

- **Listens** to your voice via Cubby (real-time transcription)
- **Understands** commands using Claude AI
- **Executes** computer actions (mouse, keyboard, etc.)

## Architecture

```
Voice → Cubby → Claude Computer Use → Computer Actions
```

## Prerequisites

1. **Cubby** running locally
   - Install from: https://cubby.sh
   - Must be running on `http://localhost:3030`
   - Enable audio recording

2. **Anthropic API Key**
   - Get from: https://console.anthropic.com/
   - Need access to Computer Use API

3. **Node.js** v18 or higher

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Copy .env and add your API key
ANTHROPIC_API_KEY=your_actual_key_here
```

3. Make sure Cubby is running locally

## Usage

Start the voice control system:

```bash
npm run dev
```

Then just **speak commands** like:
- "Open Chrome and go to GitHub"
- "Click the submit button"
- "Type hello world"
- "Take a screenshot"

## How It Works

1. You speak a command
2. Cubby transcribes it in real-time
3. Transcription sent to Claude
4. Claude analyzes and executes computer actions
5. Results logged to console

## Example Session

```
🎙️  Voice Computer Control - Starting...
📡 Connecting to Cubby at http://localhost:3030...
✅ Connected to Cubby
🎤 Listening for voice commands...

🎤 You said: "open chrome"
⏳ Processing with Claude...

🤖 Claude: I'll open Chrome for you
   Action: mouse_move
   Location: (100, 50)
   Action: left_click
✅ Done!
```

## Current Status

This is a **minimal prototype** - it logs what Claude wants to do but doesn't fully execute yet.

Next steps:
- Add full Computer Use execution
- Add visual overlay UI
- Add more sophisticated error handling

## Project Structure

```
src/
  index.ts          - Main entry point, Cubby streaming
  computer-use.ts   - Claude Computer Use integration
  types.ts          - TypeScript type definitions
.env                - Environment variables (API keys)
tsconfig.json       - TypeScript configuration
```

## Troubleshooting

**"Error connecting to Cubby"**
- Make sure Cubby app is running
- Check it's on `http://localhost:3030`

**"ANTHROPIC_API_KEY not set"**
- Add your API key to `.env` file
- Get key from https://console.anthropic.com/

**Voice not detected**
- Check Cubby has microphone access
- Speak clearly and wait for "is_final" transcription

## License

MIT

