# Quick Start Guide - Whisper Voice Control

## ✅ What's Been Built

A **working voice computer control system** using:
- **OpenAI Whisper** for voice transcription
- **Claude Computer Use** for intelligent automation
- Simple CLI interface (no complex UI yet)

## 🚀 Setup in 3 Steps

### Step 1: Get API Keys

#### OpenAI (for Whisper)
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it (starts with `sk-proj-...`)

#### Anthropic (for Claude)
1. Go to https://console.anthropic.com/
2. Create a new API key
3. Copy it (starts with `sk-ant-...`)

### Step 2: Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your keys
nano .env
```

Your `.env` should look like:
```bash
OPENAI_API_KEY=sk-proj-your-actual-key-here
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
DISPLAY_WIDTH=1920
DISPLAY_HEIGHT=1080
```

### Step 3: Grant Microphone Permission

**macOS:**
1. Open **System Settings**
2. Go to **Privacy & Security > Microphone**
3. Enable for your **Terminal** (or iTerm, etc.)
4. **Restart your terminal**

**Linux:**
- Usually works by default
- Check with: `arecord -l`

## 🎤 Run It

```bash
npm run dev
```

You should see:
```
🎙️  Voice Computer Control - Starting...

🎤 Starting microphone capture...
🎤 Microphone started (16kHz, mono)
✅ Listening for voice commands...
   (Speak clearly and pause after each command)

════════════════════════════════════════════════════════════
```

## 💬 Try These Commands

Speak these phrases (speak clearly, then wait):

1. **"Open Chrome"** - Opens your browser
2. **"Go to GitHub"** - Navigates to GitHub
3. **"Type hello world"** - Types text
4. **"Click the search button"** - Clicks elements
5. **"Take a screenshot"** - Screenshots current view

## 📝 How It Works

1. You speak (minimum 3 seconds)
2. Audio buffers and sends to Whisper
3. Whisper transcribes to text
4. Claude understands and plans actions
5. Computer Use executes mouse/keyboard
6. Results show in console

## 🐛 Troubleshooting

### "OPENAI_API_KEY not set"
✅ Create `.env` file from `.env.example`  
✅ Add your actual API key (not `your_key_here`)

### "Audio stream error"
✅ Grant microphone permissions  
✅ Restart terminal after granting  
✅ Check no other app is using mic

### Nothing transcribes
✅ Speak for at least 3 seconds  
✅ Speak louder/closer to mic  
✅ Check OpenAI API has credits

### "mic" package error on macOS
```bash
# Install SoX audio library
brew install sox
```

## 💰 Costs

- **Whisper**: $0.006/minute (~$0.36/hour)
- **Claude**: $3-8 per 100 actions
- **Total**: Very affordable for personal use

## 🎯 Tips for Best Results

1. **Speak naturally** - Don't rush, normal pace
2. **Be specific** - "Click the blue submit button on the right"
3. **Wait for buffering** - Minimum 3 seconds of speech
4. **Pause between commands** - Wait for "Ready for next command"
5. **Give context** - "Open Chrome and go to github.com" better than two commands

## 🛑 Stop the App

Press **Ctrl+C**:
```
^C

👋 Shutting down gracefully...
🎤 Microphone stopped
✅ Cleanup complete. Goodbye!
```

## 📁 What Got Created

```
src/
  index.ts          - Main app (audio → Whisper → Claude)
  audio-capture.ts  - Microphone capture
  whisper.ts        - Whisper API integration
  computer-use.ts   - Claude Computer Use
  types.ts          - TypeScript types
  mic.d.ts          - Type declarations
```

## 🎨 Next Steps

Once this works:
1. Add Electron for visual overlay
2. Add Cubby for screen context
3. Implement pointer trails/animations
4. Add speech bubbles showing Claude's thoughts

## 🆘 Still Having Issues?

1. Verify API keys are correct
2. Check you have API credits
3. Test microphone with `arecord -d 5 test.wav` (Linux) or QuickTime (Mac)
4. Check console for specific error messages

---

**Ready to try?** Run `npm run dev` and start speaking! 🎤
