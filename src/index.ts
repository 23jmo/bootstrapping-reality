// Voice Computer Control - Main Entry Point
// Uses Whisper for voice transcription and Claude Computer Use for actions

import "dotenv/config";
import { AudioCapture } from "./audio-capture.js";
import { WhisperTranscriber } from "./whisper.js";
import { executeVoiceCommand } from "./computer-use.js";
import { checkAccessibilityPermissions } from "./computer-actions-applescript.js";

/**
 * Main application function
 * Coordinates audio capture, transcription, and command execution
 */
async function main() {
  console.log("🎙️  Voice Computer Control - Starting...\n");

  // Check for Accessibility permissions (required for computer control)
  console.log("🔐 Checking Accessibility permissions...");
  if (!checkAccessibilityPermissions()) {
    console.error("❌ Error: Accessibility permissions not granted\n");
    console.error("To grant permissions:");
    console.error(
      "  1. Open System Settings > Privacy & Security > Accessibility"
    );
    console.error("  2. Click the lock icon to make changes");
    console.error("  3. Add your Terminal app (or iTerm, etc.) to the list");
    console.error("  4. Toggle it ON");
    console.error("  5. Restart this application\n");
    console.error(
      "⚠️  These permissions allow Claude to control your mouse and keyboard."
    );
    console.error("   Only enable this if you trust the system.\n");
    process.exit(1);
  }
  console.log("✅ Accessibility permissions granted\n");

  // Verify required API keys
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Error: OPENAI_API_KEY not set in .env file");
    console.error(
      "   Get your API key from: https://platform.openai.com/api-keys\n"
    );
    process.exit(1);
  }

  if (
    !process.env.ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_API_KEY === "your_key_here"
  ) {
    console.error("❌ Error: ANTHROPIC_API_KEY not set in .env file");
    console.error("   Get your API key from: https://console.anthropic.com/\n");
    process.exit(1);
  }

  console.log("🎤 Starting microphone capture...");

  // Initialize audio capture and transcription
  const audioCapture = new AudioCapture();
  const transcriber = new WhisperTranscriber();

  try {
    // Start capturing audio from microphone
    const audioStream = audioCapture.start();

    console.log("✅ Listening for voice commands...");
    console.log("   (Speak clearly and pause after each command)\n");
    console.log("═".repeat(60));

    // Process audio chunks as they arrive
    audioStream.on("data", async (chunk: Buffer) => {
      // Send audio chunk to Whisper for transcription
      const text = await transcriber.transcribe(chunk);

      // Only process if we got a transcription back
      if (text && text.trim()) {
        console.log(`\n🎤 You said: "${text}"`);

        // Check if the command contains the keyword "claude" (case-insensitive)
        if (text.toLowerCase().includes("claude")) {
          console.log("✅ Keyword 'claude' detected - processing command...");
          console.log("⏳ Processing with Claude...\n");

          try {
            // Send transcribed command to Claude Computer Use
            await executeVoiceCommand(text);

            console.log("═".repeat(60));
            console.log("🎤 Ready for next command...\n");
          } catch (error) {
            console.error("❌ Error executing command:", error);
            console.log("═".repeat(60));
            console.log("🎤 Ready for next command...\n");
          }
        } else {
          // Command doesn't contain "claude" keyword - skip processing
          console.log("⏭️  Skipped - command must contain 'claude' to execute");
          console.log("═".repeat(60));
          console.log("🎤 Ready for next command...\n");
        }
      }
    });

    // Handle audio stream errors
    audioStream.on("error", (error: Error) => {
      console.error("❌ Audio stream error:", error);
      console.error("\nTroubleshooting:");
      console.error("  1. Check microphone permissions");
      console.error("  2. Verify microphone is not in use by another app");
      console.error("  3. Try reconnecting your microphone\n");
    });

    // Graceful shutdown on Ctrl+C
    process.on("SIGINT", () => {
      console.log("\n\n👋 Shutting down gracefully...");
      audioCapture.stop();
      console.log("✅ Cleanup complete. Goodbye!");
      process.exit(0);
    });
  } catch (error) {
    console.error("\n❌ Fatal error:", error);
    console.error("\nTroubleshooting:");
    console.error("  1. Make sure your microphone is connected");
    console.error(
      "  2. Grant microphone permissions to Terminal/your terminal app"
    );
    console.error("  3. Check that no other app is using the microphone");
    console.error("  4. Verify your API keys are correct in .env\n");
    process.exit(1);
  }
}

// Run the application
main().catch((error) => {
  console.error("❌ Unhandled error:", error);
  process.exit(1);
});
