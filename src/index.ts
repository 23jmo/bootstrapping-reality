// Voice Computer Control - Main Entry Point
// Streams voice transcriptions from Cubby and sends them to Claude Computer Use

import "dotenv/config";
import { createClient } from "@cubby/js";
import { executeVoiceCommand } from "./computer-use.js";

/**
 * Main function - starts voice listening and command execution
 */
async function main() {
  console.log("🎙️  Voice Computer Control - Starting...\n");

  // Check for Anthropic API key
  if (
    !process.env.ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_API_KEY === "your_key_here"
  ) {
    console.error("❌ Error: ANTHROPIC_API_KEY not set in .env file");
    console.error("   Get your API key from: https://console.anthropic.com/\n");
    process.exit(1);
  }

  // Get Cubby configuration from environment
  const baseUrl = process.env.CUBBY_API_BASE_URL || "http://localhost:3030";
  const clientId = process.env.CUBBY_CLIENT_ID;
  const clientSecret = process.env.CUBBY_CLIENT_SECRET;

  console.log(`📡 Connecting to Cubby at ${baseUrl}...`);

  try {
    const client = createClient({ baseUrl, clientId, clientSecret });
    const devices = await client.listDevices();
    if (!devices?.devices?.length) {
      console.error("error: no devices found");
      process.exit(1);
    }
    client.setDeviceId(String(devices.devices[0].id));

    // no filtering: stream everything from the device as { name, data }
    // example event: { name: "ocr_result", data: { app_name, text, ... } }
    // for await (const evt of client.streamEvents()) {
    //   // logs: [event_name] {...data}
    //   console.log(`[${evt?.name}] ${JSON.stringify(evt?.data)}`);
    // }

    // how to filter only transcriptions (if your device emits them):
    for await (const evt of client.streamEvents()) {
      if (evt?.name === "transcription") {
        // typical shape: { name: "transcription", data: { text: string, is_final?: boolean, ts?: number, ... } }
        const { text, is_final } = evt.data || {};
        console.log(
          `[transcription] ${is_final ? "final:" : "partial:"} ${text || ""}`
        );
      }
    }

    // how to filter only vision/ocr frames:
    // for await (const evt of client.streamEvents()) {
    //   if (evt?.name === "ocr_result" || evt?.name === "ui_frame") {
    //     // ocr_result example (from ws): { name: "ocr_result", data: { app_name: string, text: string, confidence: number, ... } }
    //     const { app_name, text, confidence } = evt.data || {};
    //     console.log(`[ocr] app=${app_name || "unknown"} conf=${confidence ?? "?"} text=${(text || "").slice(0, 120)}`);
    //   }
    // }

    // Optional: Log other event types for debugging
    // Uncomment to see what else is coming through:
    // if (evt?.name === "ocr_result") {
    //   console.log(`[OCR] ${evt.data?.app_name}: ${evt.data?.text?.slice(0, 50)}...`);
    // }
  } catch (error) {
    console.error("\n❌ Error:", error);
    console.error("\nTroubleshooting:");
    console.error("  1. Make sure Cubby is running (http://localhost:3030)");
    console.error("  2. Check that audio recording is enabled in Cubby");
    console.error("  3. Verify microphone permissions are granted");
    console.error("  4. Try speaking louder or closer to the microphone\n");
    process.exit(1);
  }
}

// Run the application
main().catch(console.error);
