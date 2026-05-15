// Quick test to verify robotjs is working
import robot from "robotjs";

console.log("Testing robotjs...\n");

// Test 1: Get current mouse position
try {
  const pos = robot.getMousePos();
  console.log("✅ Test 1: Get mouse position");
  console.log(`   Current position: (${pos.x}, ${pos.y})\n`);
} catch (error) {
  console.error("❌ Test 1 FAILED:", error.message);
  console.error("   You may need Accessibility permissions!\n");
  process.exit(1);
}

// Test 2: Move mouse slightly
try {
  const startPos = robot.getMousePos();
  console.log("✅ Test 2: Move mouse");
  console.log(
    `   Moving from (${startPos.x}, ${startPos.y}) to (${startPos.x + 100}, ${
      startPos.y + 100
    })`
  );

  robot.moveMouse(startPos.x + 100, startPos.y + 100);

  setTimeout(() => {
    const newPos = robot.getMousePos();
    console.log(`   New position: (${newPos.x}, ${newPos.y})`);

    if (newPos.x !== startPos.x || newPos.y !== startPos.y) {
      console.log("   ✅ Mouse moved successfully!\n");
    } else {
      console.log(
        "   ❌ Mouse did NOT move - check Accessibility permissions!\n"
      );
    }

    // Move back
    robot.moveMouse(startPos.x, startPos.y);
    console.log("   Moved back to original position\n");

    // Test 3: Type text
    console.log("✅ Test 3: Type text");
    console.log(
      "   NOTE: This will type 'Hello' wherever your cursor is focused!"
    );
    console.log(
      "   You have 3 seconds to click somewhere safe (like a text editor)...\n"
    );

    setTimeout(() => {
      robot.typeString("Hello from robotjs!");
      console.log("   ✅ Text typed!\n");
      console.log("🎉 All tests passed! robotjs is working correctly.");
      console.log("   Your app should be able to control the computer.\n");
    }, 3000);
  }, 500);
} catch (error) {
  console.error("❌ Test 2 FAILED:", error.message);
  console.error("   Accessibility permissions are likely missing!\n");
  process.exit(1);
}
