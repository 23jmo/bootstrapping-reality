// CLI Chat Test - Test Claude Computer Use without voice
// Type commands directly to debug if Computer Use is working

import "dotenv/config";
import * as readline from "readline";
import { executeVoiceCommand } from "./computer-use.js";
import { checkAccessibilityPermissions } from "./computer-actions-applescript.js";

/**
 * Simple CLI chat interface to test Claude Computer Use
 * No voice/Whisper needed - just type commands
 */
async function main() {
  console.log("💬 CLI Chat Test Mode - Testing Claude Computer Use\n");

  // Check for Accessibility permissions
  console.log("🔐 Checking Accessibility permissions...");
  if (!checkAccessibilityPermissions()) {
    console.error("❌ Error: Accessibility permissions not granted");
    console.error(
      "   Go to: System Settings > Privacy & Security > Accessibility\n"
    );
    process.exit(1);
  }
  console.log("✅ Accessibility permissions granted\n");

  // Verify API key
  if (
    !process.env.ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_API_KEY === "your_key_here"
  ) {
    console.error("❌ Error: ANTHROPIC_API_KEY not set in .env file");
    console.error("   Get your API key from: https://console.anthropic.com/\n");
    process.exit(1);
  }

  console.log("📋 Instructions:");
  console.log("   - Type commands containing 'claude' to execute");
  console.log("   - Example: 'claude, move mouse to 500, 500'");
  console.log("   - Press Ctrl+C to exit\n");
  console.log("═".repeat(60));
  console.log();

  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "💬 You: ",
  });

  rl.prompt();

  rl.on("line", async (input: string) => {
    const text = input.trim();

    if (!text) {
      rl.prompt();
      return;
    }

    console.log(); // Blank line for readability

    // Check for "claude" keyword (case-insensitive)
    if (text.toLowerCase().includes("claude")) {
      console.log("✅ Keyword 'claude' detected - processing command...");
      console.log("⏳ Processing with Claude...\n");

      try {
        // Send to Claude Computer Use
        await executeVoiceCommand(text);

        console.log("\n" + "═".repeat(60));
        console.log();
      } catch (error) {
        console.error("\n❌ Error executing command:", error);
        console.log("═".repeat(60));
        console.log();
      }
    } else {
      // Command doesn't contain "claude" keyword - skip
      console.log("⏭️  Skipped - command must contain 'claude' to execute");
      console.log("═".repeat(60));
      console.log();
    }

    rl.prompt();
  });

  rl.on("close", () => {
    console.log("\n\n👋 Goodbye!");
    process.exit(0);
  });

  // Handle Ctrl+C
  process.on("SIGINT", () => {
    console.log("\n\n👋 Shutting down...");
    rl.close();
  });
}

// Run the chat
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

