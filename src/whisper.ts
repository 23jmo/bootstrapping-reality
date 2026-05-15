// Whisper Transcription Service
// Handles audio-to-text conversion using OpenAI's Whisper API

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * WhisperTranscriber class for converting audio chunks to text
 * Buffers audio and sends to Whisper API when enough data is accumulated
 */
export class WhisperTranscriber {
  private audioBuffer: Buffer[] = [];
  private isProcessing = false;

  /**
   * Process an audio chunk and return transcription when ready
   * @param audioChunk - Raw audio data buffer
   * @returns Transcribed text or null if not enough audio yet
   */
  async transcribe(audioChunk: Buffer): Promise<string | null> {
    // Buffer incoming audio chunks
    this.audioBuffer.push(audioChunk);

    // Calculate total buffered audio size
    const totalSize = this.audioBuffer.reduce(
      (sum, buf) => sum + buf.length,
      0
    );

    // Minimum audio size: 3 seconds at 16kHz, 16-bit, mono
    // 16000 samples/sec * 2 bytes/sample * 3 seconds = 96000 bytes
    // We accumulate audio and rely on silence detection (exitOnSilence) to trigger processing
    const minSize = 16000 * 2 * 3;

    // Only process if we have enough audio and aren't already processing
    if (totalSize >= minSize && !this.isProcessing) {
      this.isProcessing = true;

      // Combine all buffered chunks
      const audioData = Buffer.concat(this.audioBuffer);
      this.audioBuffer = []; // Clear buffer

      // Create temporary WAV file
      const tempFile = path.join("/tmp", `audio-${Date.now()}.wav`);
      const wavFile = this.createWavFile(audioData);
      fs.writeFileSync(tempFile, wavFile);

      try {
        // Send to Whisper API
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(tempFile),
          model: "whisper-1",
          language: "en",
          response_format: "text",
        });

        // Cleanup temp file
        fs.unlinkSync(tempFile);
        this.isProcessing = false;

        return transcription as string;
      } catch (error) {
        console.error("❌ Whisper API error:", error);

        // Cleanup on error
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }

        this.isProcessing = false;
        return null;
      }
    }

    return null;
  }

  /**
   * Create a WAV file with proper header from raw PCM audio data
   * @param audioData - Raw PCM audio buffer
   * @returns Complete WAV file buffer with header
   */
  private createWavFile(audioData: Buffer): Buffer {
    // WAV file header for PCM audio
    // Format: 16kHz sample rate, mono, 16-bit
    const header = Buffer.alloc(44);

    // RIFF chunk descriptor
    header.write("RIFF", 0);
    header.writeUInt32LE(36 + audioData.length, 4); // File size - 8
    header.write("WAVE", 8);

    // fmt sub-chunk
    header.write("fmt ", 12);
    header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
    header.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
    header.writeUInt16LE(1, 22); // NumChannels (1 = mono)
    header.writeUInt32LE(16000, 24); // SampleRate (16kHz)
    header.writeUInt32LE(32000, 28); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
    header.writeUInt16LE(2, 32); // BlockAlign (NumChannels * BitsPerSample/8)
    header.writeUInt16LE(16, 34); // BitsPerSample (16-bit)

    // data sub-chunk
    header.write("data", 36);
    header.writeUInt32LE(audioData.length, 40);

    // Combine header and audio data
    return Buffer.concat([header, audioData]);
  }

  /**
   * Clear any buffered audio data
   */
  clearBuffer() {
    this.audioBuffer = [];
  }

  /**
   * Check if transcription is currently in progress
   */
  isBusy(): boolean {
    return this.isProcessing;
  }
}
