// Setup verification script
// Run this to check if everything is configured correctly

import { config } from "dotenv";

config();

console.log("🔍 Verifying setup...\n");

let allGood = true;

// Check Anthropic API key
if (
  !process.env.ANTHROPIC_API_KEY ||
  process.env.ANTHROPIC_API_KEY === "your_key_here"
) {
  console.log("❌ ANTHROPIC_API_KEY not configured");
  console.log("   → Get your key from https://console.anthropic.com/");
  console.log("   → Add it to .env file\n");
  allGood = false;
} else {
  console.log("✅ ANTHROPIC_API_KEY is set");
}

// Check Cubby URL
const cubbyUrl = process.env.CUBBY_API_BASE_URL || "http://localhost:3030";
console.log(`✅ Cubby URL: ${cubbyUrl}`);

// Check display settings
const width = process.env.DISPLAY_WIDTH || "1920";
const height = process.env.DISPLAY_HEIGHT || "1080";
console.log(`✅ Display: ${width}x${height}`);

console.log("\n" + "─".repeat(50));

if (allGood) {
  console.log("\n✅ Setup looks good! You can run: npm run dev\n");
  console.log("Make sure Cubby is running before starting.\n");
} else {
  console.log("\n⚠️  Please fix the issues above before running.\n");
  process.exit(1);
}
