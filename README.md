# Voice Computer Control

A voice-native interface for controlling your computer using OpenAI Whisper for transcription and Claude's Computer Use API for intelligent automation.

## What This Does

- **Listens** to your voice via microphone (real-time capture)
- **Transcribes** using OpenAI Whisper API
- **Understands** commands using Claude AI
- **Executes** computer actions (mouse, keyboard, etc.)

## Architecture

```
Microphone → Whisper API → Claude Computer Use → Computer Actions
```

## Why Whisper Instead of Cubby?

- More reliable real-time transcription
- Simpler setup (just API key, no device enrollment)
- Industry-standard accuracy
- Can still add Cubby later for screen context

## Prerequisites

1. **Node.js** v18 or higher
2. **OpenAI API Key**
   - Get from: https://platform.openai.com/api-keys
   - Cost: ~$0.006/minute of audio (~$0.36/hour)
3. **Anthropic API Key**
   - Get from: https://console.anthropic.com/
   - Need access to Computer Use API
4. **Microphone** with system permissions granted

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example file and add your API keys:

```bash
cp .env.example .env
# Then edit .env and add your actual API keys
```

Your `.env` should look like:

```bash
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
DISPLAY_WIDTH=1920
DISPLAY_HEIGHT=1080
```

### 3. Grant System Permissions

On macOS, you need to grant **two permissions**:

#### Microphone Permission

1. Go to **System Settings > Privacy & Security > Microphone**
2. Enable access for your **Terminal** app (or iTerm, etc.)
3. You may need to restart your terminal after granting permission

#### Accessibility Permission (⚠️ REQUIRED for Computer Control)

1. Go to **System Settings > Privacy & Security > Accessibility**
2. Click the lock icon to make changes (enter your password)
3. Click the **+** button and add your **Terminal** app (or iTerm, etc.)
4. Make sure the toggle is **ON**
5. Restart your terminal

**Why Accessibility?** This allows Claude to actually control your mouse and keyboard. Without this, the app will not start.

⚠️ **Security Note:** This gives the application real control over your computer. Only enable if you trust the system and monitor what Claude does.

## Usage

Start the voice control system:

```bash
npm run dev
```

You'll see:

```
🎙️  Voice Computer Control - Starting...

🎤 Starting microphone capture...
🎤 Microphone started (16kHz, mono)
✅ Listening for voice commands...
   (Speak clearly and pause after each command)

════════════════════════════════════════════════════════════
```

Then just **speak commands** containing the keyword **"claude"** like:

- "Claude, open Chrome and go to GitHub"
- "Hey Claude, click the submit button"
- "Claude, type hello world in the search box"
- "Claude, take a screenshot"
- "Claude, close this window"

**Note:** Commands must include the word "claude" (case-insensitive) to be processed. This prevents accidental activation from regular conversation.

## How It Works

1. **You speak** a command containing "claude"
2. **Microphone captures** audio (16kHz, mono)
3. **Silence detection** waits 2 seconds after you stop speaking
4. **Audio buffers** accumulate (3 seconds minimum)
5. **Whisper transcribes** the audio to text
6. **Keyword filter** checks for "claude" in transcription
7. **Claude analyzes** and plans actions (if keyword found)
8. **Computer Use executes** mouse/keyboard actions
9. **Results logged** to console

## Example Session

```
🎤 You said: "Claude, open chrome"
✅ Keyword 'claude' detected - processing command...
⏳ Processing with Claude...

🤖 Claude: I'll open Chrome for you
   Action: mouse_move
   Location: (100, 50)
   Action: left_click
✅ Done!

════════════════════════════════════════════════════════════
🎤 Ready for next command...
```

**Example of skipped command (no keyword):**

```
🎤 You said: "I think I'll open Chrome later"
⏭️  Skipped - command must contain 'claude' to execute
════════════════════════════════════════════════════════════
🎤 Ready for next command...
```

## ⚠️ Safety & Security

**This application gives Claude REAL control over your computer!**

### What Claude Can Do:

- ✅ Move your mouse cursor
- ✅ Click anywhere on screen
- ✅ Type text (including passwords if you're not careful!)
- ✅ Press keyboard shortcuts
- ✅ Take screenshots of your screen

### Safety Tips:

1. **Start with simple commands** - Test with "Claude, move mouse" first
2. **Watch what it does** - Don't leave it unattended initially
3. **Use the keyword filter** - Only commands with "claude" execute
4. **Press Ctrl+C anytime** - Immediately stops all actions
5. **Be careful what you say** - Don't give commands near sensitive data
6. **Test in a safe environment** - Try in an empty workspace first

### Not Recommended For:

- ❌ Financial transactions
- ❌ Anything involving passwords or sensitive data
- ❌ Automated tasks you can't supervise
- ❌ System administration commands

**Remember:** You're giving an AI control of your mouse and keyboard. Use responsibly!

## Project Structure

```
src/
  index.ts            - Main entry point, coordinates everything
  audio-capture.ts    - Microphone audio capture
  whisper.ts          - Whisper API transcription
  computer-use.ts     - Claude Computer Use integration
  computer-actions.ts - Actual computer control (robotjs)
  types.ts            - TypeScript type definitions
.env                  - API keys (create from .env.example)
package.json          - Dependencies and scripts
```

## Key Features

### Audio Capture

- 16kHz sample rate (Whisper standard)
- Mono channel (optimal for speech)
- Continuous streaming
- Auto-stops after 2 seconds of silence (captures full sentences)

### Whisper Transcription

- Buffers 3 seconds minimum before transcribing
- Accumulates audio until silence detected
- Handles WAV file creation automatically
- Error recovery and cleanup
- Real-time processing

### Keyword Filtering

- Only processes commands containing "claude"
- Case-insensitive detection
- Prevents accidental activation
- Clear feedback when commands are skipped

### Claude Computer Use

- Uses beta Computer Use API (computer-use-2024-10-22)
- **Real computer control** via robotjs library
- Executes actual mouse movements and clicks
- Types text and presses keys on your keyboard
- Takes screenshots and sends them to Claude (so Claude can "see" your screen!)
- Claude uses visual feedback to make better decisions
- Intelligent action planning
- Multi-step task execution
- Context-aware commands
- Error handling with detailed feedback

## Troubleshooting

### "Accessibility permissions not granted"

**This is the most common issue!**

- Go to System Settings > Privacy & Security > Accessibility
- Add your Terminal app and toggle it ON
- Restart the application
- Without these permissions, Claude cannot control your computer

### "OPENAI_API_KEY not set"

- Create `.env` file from `.env.example`
- Add your OpenAI API key

### "ANTHROPIC_API_KEY not set"

- Add your Anthropic API key to `.env`
- Get it from https://console.anthropic.com/

### "Audio stream error"

- Check microphone permissions in System Settings
- Verify no other app is using the microphone
- Try unplugging and reconnecting external mic

### No transcription appearing

- Speak louder or closer to the microphone
- Wait at least 3 seconds before pausing (minimum audio length)
- Check your OpenAI API key is valid
- Verify you have API credits remaining

### "mic" package errors on macOS

If you get errors about SoX:

```bash
brew install sox
```

## Costs

### OpenAI Whisper

- **$0.006 per minute** of audio
- ~$0.36 per hour
- Very affordable for personal use

### Claude Computer Use

- **$3-8 per 100 actions** (approximate)
- Depends on model and complexity

## Future Enhancements

### Optional: Add Cubby for Screen Context

Once voice control works, you can optionally add Cubby to provide screen context to Claude:

```typescript
import { createClient } from "@cubby/js";

// Get what's on screen
const cubby = createClient({ baseUrl: "http://localhost:3030" });
const screenContext = await cubby.search({ q: "current window", limit: 3 });

// Send to Claude with voice + visual context
await executeVoiceCommand(voiceText, screenContext);
```

This gives Claude both:

- What you **said** (via Whisper)
- What's on your **screen** (via Cubby OCR)

## Stop the Application

Press **Ctrl+C** to gracefully shut down:

```
^C

👋 Shutting down gracefully...
🎤 Microphone stopped
✅ Cleanup complete. Goodbye!
```

## Scripts

```bash
npm run dev     # Run in development mode
npm run build   # Build TypeScript to JavaScript
npm run verify  # Verify setup and API keys
```

## Tips for Best Results

1. **Always say "claude"** - Start or include "claude" in your command
2. **Speak clearly** - Natural pace, not too fast
3. **Pause after speaking** - Wait 2 seconds of silence for detection
4. **Be specific** - "Claude, click the blue button on the right" vs "click that"
5. **Give context** - "Claude, open Chrome and go to github.com" works better than separate commands
6. **Wait for buffering** - Minimum 3 seconds of audio needed

## License

MIT

## Contributing

Issues and PRs welcome! This is a prototype for exploring voice-native computer control.
