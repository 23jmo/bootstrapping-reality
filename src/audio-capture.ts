// Audio Capture Module
// Handles microphone input and audio streaming

import mic from "mic";
import { Readable } from "stream";

/**
 * AudioCapture class for capturing microphone audio
 * Uses the 'mic' package to interface with system microphone
 */
export class AudioCapture {
  private micInstance: any;
  private audioStream: Readable | null = null;

  /**
   * Start capturing audio from the microphone
   * @returns Readable stream of audio data
   */
  start(): Readable {
    // Create microphone instance with specific settings
    this.micInstance = mic({
      rate: "16000", // 16kHz sample rate (Whisper standard)
      channels: "1", // Mono audio
      debug: false, // Disable debug logging
      exitOnSilence: 2, // Stop after 2 seconds of silence (captures full sentences)
    });

    // Get the audio stream
    this.audioStream = this.micInstance.getAudioStream();

    // Handle audio stream errors
    this.audioStream?.on("error", (error: Error) => {
      console.error("🎤 Audio stream error:", error);
    });

    // Start recording
    this.micInstance.start();
    console.log("🎤 Microphone started (16kHz, mono)");

    return this.audioStream as Readable;
  }

  /**
   * Stop capturing audio and cleanup
   */
  stop() {
    if (this.micInstance) {
      this.micInstance.stop();
      console.log("🎤 Microphone stopped");
    }
  }

  /**
   * Check if microphone is currently active
   */
  isActive(): boolean {
    return this.audioStream !== null;
  }
}
