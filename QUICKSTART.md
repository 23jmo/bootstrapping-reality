# Quick Start Guide

## ✅ What's Built

You now have a **working voice computer control CLI** that:
- Streams voice from Cubby in real-time
- Sends commands to Claude Computer Use API
- Logs all actions to console

## 🚀 How to Run

### 1. Get Your Anthropic API Key
1. Go to https://console.anthropic.com/
2. Sign up / sign in
3. Create an API key
4. Copy the key

### 2. Configure Environment
The `.env` file needs your API key. Since it's gitignored, you'll need to add it:

```bash
# Edit .env and replace 'your_key_here' with your actual key
ANTHROPIC_API_KEY=sk-ant-xxxxx...
```

### 3. Start Cubby
Make sure Cubby is running on your Mac:
- Open Cubby app
- Ensure it's recording audio
- Verify it's on http://localhost:3030

### 4. Run the App
```bash
npm run dev
```

You should see:
```
🎙️  Voice Computer Control - Starting...
📡 Connecting to Cubby at http://localhost:3030...
✅ Connected to Cubby
🎤 Listening for voice commands...
```

### 5. Speak Commands
Try saying:
- "Open Chrome"
- "Search for GitHub"
- "Click the login button"

Watch the console for Claude's responses!

## 📁 Project Structure

```
bootstrapping-reality/
├── src/
│   ├── index.ts           # Main entry - voice streaming
│   ├── computer-use.ts    # Claude integration
│   └── types.ts           # TypeScript types
├── .env                   # Your API keys (NOT in git)
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── README.md              # Full documentation
```

## 🎨 Next Steps (UI Layer)

When you're ready to add the visual overlay:

1. **Add Electron**
```bash
npm install electron electron-builder
```

2. **Create overlay window**
- Transparent, always-on-top
- Canvas for pointer trails
- Speech bubbles for Claude's thoughts

3. **Connect IPC**
- Main process ↔️ Renderer
- Send action events to UI
- Animate in real-time

## 🐛 Troubleshooting

**"Error connecting to Cubby"**
- Cubby app must be running
- Check http://localhost:3030 in browser

**"ANTHROPIC_API_KEY not set"**
- Edit `.env` file
- Add your real API key

**Voice not working**
- Check Cubby has mic access
- Try speaking louder/clearer
- Wait for final transcription

## 💡 Tips

- Commands work best as clear instructions
- Claude can see your screen (via screenshots)
- Be specific: "click the blue button" not "click that"
- You can chain actions: "open chrome and go to github"

## 📝 Current Limitations

This is a **minimal prototype**:
- ✅ Voice input works
- ✅ Claude processes commands
- ⚠️ Actions are logged but not fully executed yet
- ❌ No visual UI yet

The Computer Use API integration is there, but you may need to configure additional permissions for full execution.

---

**Have fun bootstrapping reality! 🚀**

