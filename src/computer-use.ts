// Claude Computer Use integration
// Handles sending voice commands to Claude and executing computer actions

import Anthropic from "@anthropic-ai/sdk";
import type { ComputerAction } from "./types.js";
import { executeComputerAction } from "./computer-actions-applescript.js";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Get display dimensions from environment
const DISPLAY_WIDTH = parseInt(process.env.DISPLAY_WIDTH || "1920", 10);
const DISPLAY_HEIGHT = parseInt(process.env.DISPLAY_HEIGHT || "1080", 10);

/**
 * Execute a voice command using Claude Computer Use API
 * Claude will analyze the command and perform computer actions
 */
export async function executeVoiceCommand(command: string): Promise<void> {
  // Initialize conversation with user's command
  const messages: Anthropic.Beta.Messages.BetaMessageParam[] = [
    {
      role: "user",
      content: command,
    },
  ];

  let continueLoop = true;

  // Continue conversation until Claude completes the task
  while (continueLoop) {
    try {
      // Call Claude with computer use tools enabled (using beta namespace)
      const response = await anthropic.beta.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        betas: ["computer-use-2024-10-22"], // Required beta header for Computer Use API
        tools: [
          {
            name: "computer",
            type: "computer_20241022",
            display_width_px: DISPLAY_WIDTH,
            display_height_px: DISPLAY_HEIGHT,
          } as any,
        ], // Computer Use is a beta feature with specific typing
        messages,
      });

      // Log Claude's reasoning/response
      const textContent = response.content.find((c) => c.type === "text");
      if (textContent && "text" in textContent) {
        console.log("🤖 Claude:", textContent.text);
      }

      // Process any tool uses (computer actions)
      const toolUses = response.content.filter((c) => c.type === "tool_use");

      // Debug: Log what Claude is doing
      console.log(
        `\n🔍 Debug: Claude returned ${response.content.length} content blocks`
      );
      console.log(
        `   - Text blocks: ${
          response.content.filter((c) => c.type === "text").length
        }`
      );
      console.log(`   - Tool uses: ${toolUses.length}`);
      if (toolUses.length > 0) {
        console.log(
          `   - Tool names: ${toolUses
            .map((t) => (t.type === "tool_use" ? t.name : "unknown"))
            .join(", ")}`
        );
      }

      if (toolUses.length > 0) {
        // Add Claude's response to conversation
        messages.push({
          role: "assistant",
          content: response.content,
        });

        // Execute each tool use and collect results
        const toolResults: Anthropic.Beta.Messages.BetaToolResultBlockParam[] =
          [];

        for (const toolUse of toolUses) {
          if (toolUse.type === "tool_use" && toolUse.name === "computer") {
            const action = toolUse.input as ComputerAction;

            // Log the action being performed
            console.log(`   Action: ${action.action}`);
            if (action.coordinate) {
              console.log(
                `   Location: (${action.coordinate[0]}, ${action.coordinate[1]})`
              );
            }
            if (action.text) {
              console.log(`   Text: "${action.text}"`);
            }

            // Execute the actual computer action
            const result = await executeComputerAction(action);
            console.log(`   Result: ${result}`);

            // Return the result to Claude
            toolResults.push({
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: result,
            });
          }
        }

        // Add tool results to conversation
        messages.push({
          role: "user",
          content: toolResults,
        });
        console.log("✅ Tool results:", toolResults);
      } else {
        // No more tool uses, task is complete
        continueLoop = false;
        console.log("✅ Done!\n");
      }

      // Check stop reason
      if (response.stop_reason === "end_turn") {
        continueLoop = false;
        console.log("✅ Done!\n");
      }
    } catch (error) {
      console.error("❌ Error executing command:", error);
      continueLoop = false;
    }
  }
}
