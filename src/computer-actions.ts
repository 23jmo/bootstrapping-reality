// Computer Actions Module
// Executes actual computer control actions using robotjs

import robot from "robotjs";
import { ComputerAction } from "./types.js";
import sharp from "sharp";

/**
 * Execute a computer action (mouse, keyboard, screenshot)
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
        robot.moveMouse(x, y);
        return `Moved mouse to (${x}, ${y})`;

      case "left_click":
        robot.mouseClick("left");
        return "Left click executed";

      case "right_click":
        robot.mouseClick("right");
        return "Right click executed";

      case "middle_click":
        robot.mouseClick("middle");
        return "Middle click executed";

      case "double_click":
        robot.mouseClick("left", true); // true = double click
        return "Double click executed";

      case "cursor_position":
        const pos = robot.getMousePos();
        return JSON.stringify({ x: pos.x, y: pos.y });

      case "type":
        if (!action.text) {
          return "Error: type action requires text";
        }
        robot.typeString(action.text);
        return `Typed: "${action.text}"`;

      case "key":
        if (!action.text) {
          return "Error: key action requires text (key name)";
        }
        // Handle special keys and modifiers
        const keys = action.text.toLowerCase().split("+");
        if (keys.length > 1) {
          // Modifier key combination (e.g., "command+c")
          const modifiers = keys.slice(0, -1);
          const key = keys[keys.length - 1];
          robot.keyTap(key, modifiers);
          return `Pressed: ${action.text}`;
        } else {
          // Single key
          robot.keyTap(action.text);
          return `Pressed key: ${action.text}`;
        }

      case "screenshot":
        // Take screenshot and return compressed base64 JPEG for Claude to "see"
        const screenshot = robot.screen.capture();
        const width = screenshot.width;
        const height = screenshot.height;

        // robotjs provides raw BGRA bitmap data
        const bitmap = screenshot.image;

        // Create a buffer from the bitmap data
        // robotjs returns BGRA format, need to convert to RGBA for sharp
        const buffer = Buffer.alloc(width * height * 4);
        for (let i = 0; i < bitmap.length; i += 4) {
          // BGRA -> RGBA conversion
          buffer[i] = bitmap[i + 2]; // R
          buffer[i + 1] = bitmap[i + 1]; // G
          buffer[i + 2] = bitmap[i]; // B
          buffer[i + 3] = bitmap[i + 3]; // A
        }

        // Downsample to max 1280px width (preserves aspect ratio)
        // Use JPEG with quality=60 for much smaller file size
        const maxWidth = 1280;
        const scaleFactor = width > maxWidth ? maxWidth / width : 1;

        const jpegBuffer = await sharp(buffer, {
          raw: {
            width: width,
            height: height,
            channels: 4,
          },
        })
          .resize({
            width: Math.floor(width * scaleFactor),
            height: Math.floor(height * scaleFactor),
            fit: "inside",
          })
          .jpeg({ quality: 60 }) // JPEG with 60% quality for smaller size
          .toBuffer();

        const base64 = jpegBuffer.toString("base64");

        console.log(
          `   📸 Screenshot: ${width}x${height} → ${Math.floor(
            width * scaleFactor
          )}x${Math.floor(height * scaleFactor)} (${Math.round(
            base64.length / 1024
          )}KB)`
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
    // Try to get mouse position - this requires Accessibility permissions
    robot.getMousePos();
    return true;
  } catch (error) {
    return false;
  }
}
