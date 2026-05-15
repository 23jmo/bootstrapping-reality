// Computer Actions Module - AppleScript/Native macOS Implementation
// Uses native macOS tools for reliable computer control

import { ComputerAction } from "./types.js";
import { execSync } from "child_process";
import sharp from "sharp";
import fs from "fs";
import path from "path";

/**
 * Execute a computer action using native macOS tools
 * @param action - The action to execute from Claude Computer Use API
 * @returns Result message or base64 screenshot data
 */
export async function executeComputerAction(
  action: ComputerAction
): Promise<string> {
  try {
    switch (action.action) {
      case "mouse_move":
        if (!action.coordinate) {
          return "Error: mouse_move requires coordinate [x, y]";
        }
        const [x, y] = action.coordinate;
        // Use cliclick to move mouse (native macOS)
        execSync(`cliclick m:${x},${y}`, { stdio: "pipe" });
        return `Moved mouse to (${x}, ${y})`;

      case "left_click":
        // Use cliclick for left click
        execSync(`cliclick c:.`, { stdio: "pipe" });
        return "Left click executed";

      case "right_click":
        // Use cliclick for right click
        execSync(`cliclick rc:.`, { stdio: "pipe" });
        return "Right click executed";

      case "middle_click":
        // Use cliclick for middle click
        execSync(`cliclick mc:.`, { stdio: "pipe" });
        return "Middle click executed";

      case "double_click":
        // Use cliclick for double click
        execSync(`cliclick dc:.`, { stdio: "pipe" });
        return "Double click executed";

      case "cursor_position":
        // Use cliclick to get current position
        const output = execSync(`cliclick p`, { encoding: "utf-8" });
        // Output format: "X,Y"
        const [posX, posY] = output.trim().split(",");
        return JSON.stringify({ x: parseInt(posX), y: parseInt(posY) });

      case "type":
        if (!action.text) {
          return "Error: type action requires text";
        }
        // Use osascript (AppleScript) to type text reliably
        // Escape single quotes in the text
        const escapedText = action.text.replace(/'/g, "'\\''");
        const script = `tell application "System Events" to keystroke "${escapedText}"`;
        execSync(`osascript -e '${script}'`, { stdio: "pipe" });
        return `Typed: "${action.text}"`;

      case "key":
        if (!action.text) {
          return "Error: key action requires text (key name)";
        }
        // Handle keyboard shortcuts using osascript
        const keys = action.text.toLowerCase().split("+");

        if (keys.length > 1) {
          // Modifier key combination (e.g., "command+c")
          const modifiers = keys.slice(0, -1);
          const key = keys[keys.length - 1];

          // Map modifier names to AppleScript modifiers
          const modifierMap: Record<string, string> = {
            command: "command down",
            cmd: "command down",
            control: "control down",
            ctrl: "control down",
            option: "option down",
            opt: "option down",
            alt: "option down",
            shift: "shift down",
          };

          const modifierString = modifiers
            .map((m) => modifierMap[m] || "")
            .filter((m) => m)
            .join(", ");

          const keyScript = `tell application "System Events" to keystroke "${key}" using {${modifierString}}`;
          execSync(`osascript -e '${keyScript}'`, { stdio: "pipe" });
          return `Pressed: ${action.text}`;
        } else {
          // Single key press
          const keyScript = `tell application "System Events" to keystroke "${action.text}"`;
          execSync(`osascript -e '${keyScript}'`, { stdio: "pipe" });
          return `Pressed key: ${action.text}`;
        }

      case "screenshot":
        // Use native macOS screencapture command
        const tempFile = path.join("/tmp", `screenshot-${Date.now()}.png`);

        // Capture screenshot to file
        execSync(`screencapture -x ${tempFile}`, { stdio: "pipe" });

        // Read the file
        const imageBuffer = fs.readFileSync(tempFile);

        // Get image dimensions and resize if needed
        const metadata = await sharp(imageBuffer).metadata();
        const width = metadata.width || 0;
        const height = metadata.height || 0;

        // Downsample to max 1280px width (preserves aspect ratio)
        // Use JPEG with quality=60 for smaller file size
        const maxWidth = 1280;
        const scaleFactor = width > maxWidth ? maxWidth / width : 1;

        const jpegBuffer = await sharp(imageBuffer)
          .resize({
            width: Math.floor(width * scaleFactor),
            height: Math.floor(height * scaleFactor),
            fit: "inside",
          })
          .jpeg({ quality: 60 }) // JPEG with 60% quality for smaller size
          .toBuffer();

        const base64 = jpegBuffer.toString("base64");

        // Clean up temp file
        fs.unlinkSync(tempFile);

        console.log(
          `   📸 Screenshot: ${width}x${height} → ${Math.floor(width * scaleFactor)}x${Math.floor(height * scaleFactor)} (${Math.round(base64.length / 1024)}KB)`
        );

        // Return in the format Claude expects for images
        return `data:image/jpeg;base64,${base64}`;

      default:
        return `Unknown action: ${action.action}`;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error executing action ${action.action}:`, errorMsg);
    return `Error executing ${action.action}: ${errorMsg}`;
  }
}

/**
 * Check if the app has Accessibility permissions on macOS
 * @returns true if permissions are granted
 */
export function checkAccessibilityPermissions(): boolean {
  try {
    // Try to get mouse position using cliclick
    execSync("cliclick p", { stdio: "pipe" });
    return true;
  } catch (error) {
    return false;
  }
}


